'use strict';

var _ = require('lodash'),
    async = require('async');

var instagram = require('instagram-node').instagram();

instagram.use({
    access_token: '1035958982.117ba06.4abe0116ea094d489f0b6f2218942979',
    client_id: '117ba064c0dc48249c0804d1b36f9524',
    client_secret: '01e9ed98b82a4cee91769631dd3122cb'
});

var getImagesByTag = function(tag, fromTime, callback) {
    instagram.tag_media_recent(tag, {}, function(err, medias, remaining, limit) {
        console.log(medias);
        if (err) {
            callback(err, null);
        } else {
            if (fromTime) {
                medias = _.filter(medias, function(media) {
                    return media.created_time > fromTime;
                });
            }
            medias = _.map(medias, function(media) {
                return {
                    timestamp: parseInt(media.created_time),
                    url: media.images.standard_resolution.url,
                    thumbnail: media.images.thumbnail.url,
                    tags: media.tags
                };
            });
            callback(null, medias);
        }
    });
};

exports.getImagesByTags = function(tags, fromTime, callback) {
	var tagLoop = _.map(tags, function(tag) {
		return function(parallelCallback) {
			getImagesByTag(tag, fromTime, parallelCallback);
		};
	});
    async.parallel(tagLoop, function(err, images) {
    	images = _.flatten(images);
    	images = _.sortBy(images, 'timestamp');
        callback(err, images);
    });
};
