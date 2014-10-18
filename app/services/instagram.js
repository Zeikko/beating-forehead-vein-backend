    'use strict';

    var _ = require('lodash'),
        async = require('async');

    var instagram = require('instagram-node').instagram();

    instagram.use({
        access_token: '1035958982.117ba06.4abe0116ea094d489f0b6f2218942979',
        client_id: '117ba064c0dc48249c0804d1b36f9524',
        client_secret: '01e9ed98b82a4cee91769631dd3122cb'
    });

    var mapMediaData = function(medias) {
        return _.map(medias, function(media) {
            return {
                timestamp: parseInt(media.created_time),
                url: media.images.standard_resolution.url,
                thumbnail: media.images.thumbnail.url,
                tag: media.tags[0]
            };
        });
    }

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
                medias = mapMediaData(medias);
                images = images.concat(medias);
            }
            if (pagination && pagination.next && images.length < 40) {
                pagination.next(getPage);
            } else {
                callback(null, images);
            }
        };
        instagram.tag_media_recent(tag, getPage);
    };

    exports.getImagesByTagsAndLocation = function(tags, location, fromTime, callback) {
        instagram.media_search(location[0], location[1], {
            distance: 1000
        }, function(err, medias, remaining, limit) {
            console.log(remaining);
            console.log(limit);
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (fromTime) {
                    medias = _.filter(medias, function(media) {
                        return media.created_time > fromTime;
                    });
                }
                medias = _.filter(medias, function(media) {
                    var found = false;
                    _.forEach(tags, function(tag) {
                        if (media.tags.indexOf(tag) > -1) {
                            console.log(media.tags);
                            found = true;
                        }
                    });
                    return found;
                });
                var images = mapMediaData(medias);
            }
            callback(null, images);
        });
    }

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
