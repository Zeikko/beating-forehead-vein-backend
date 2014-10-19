    'use strict';

    var _ = require('lodash'),
        async = require('async');

    var instagram = require('instagram-node').instagram();

    instagram.use({
        access_token: process.env.instagram_access_token,
        client_id: process.env.instagram_client_id,
        client_secret: process.env.instagram_client_secret
    });

    var mapMediaData = function(medias) {
        return _.map(medias, function(media) {
            return {
                timestamp: parseInt(media.created_time),
                url: media.images.low_resolution.url,
                thumbnail: media.images.thumbnail.url,
                tag: media.tags[0]
            };
        });
    };

    var getImagesByTag = function(tag, imagesPerTag, fromTime, callback) {
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
                if(imagesPerTag < 20) {
                    var i = 0;
                    medias = _.filter(medias, function(media) {
                        i = i + 1;
                        if(i <= imagesPerTag) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
                images = images.concat(medias);
            }
            if (pagination && pagination.next && images.length < imagesPerTag) {
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
            var images;
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
                images = mapMediaData(medias);
            }
            callback(null, images);
        });
    };

    exports.getImagesByTags = function(tags, imagesPerTag, fromTime, callback) {
        var tagLoop = _.map(tags, function(tag) {
            return function(parallelCallback) {
                getImagesByTag(tag, imagesPerTag, fromTime, parallelCallback);
            };
        });
        async.parallel(tagLoop, function(err, images) {
            if (!err) {
                images = _.flatten(images);
                images = _.shuffle(images);
            }
            callback(err, images);
        });
    };
