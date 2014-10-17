'use strict';

var _ = require('lodash');

var instagram = require('instagram-node').instagram();

instagram.use({
    access_token: '1035958982.117ba06.4abe0116ea094d489f0b6f2218942979',
    client_id: '117ba064c0dc48249c0804d1b36f9524',
    client_secret: '01e9ed98b82a4cee91769631dd3122cb'
});

exports.nature = function(fromTime, callback) {
    instagram.media_search(60.170833, 24.9375, {}, function(err, medias, remaining, limit) {
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
                    url: media.images.standard_resolution.url
                };
            });
            callback(null, {
                images: medias
            });
        }
    });
};
