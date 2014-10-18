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
        var images = [];
        var getPage = function(err, medias, pagination, remaining, limit) {
            if (err) {
                console.log(err);
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
                        tag: media.tags[0]
                    };
                });
                images = images.concat(medias);
            }
            if (pagination && pagination.next && images.length < 100) {
                pagination.next(getPage);
            } else {
                callback(null, images);
            }
        };
        instagram.tag_media_recent(tag, getPage);
    };

    exports.getImagesByTags = function(tags, fromTime, callback) {
        var tagLoop = _.map(tags, function(tag) {
            return function(parallelCallback) {
                getImagesByTag(tag, fromTime, parallelCallback);
            };
        });
        async.parallel(tagLoop, function(err, images) {
            if (!err) {
                images = _.flatten(images);
                images = _.sortBy(images, 'timestamp');
            }
            callback(err, images);
        });
    };
