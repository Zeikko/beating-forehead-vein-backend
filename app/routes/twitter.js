'use strict';

var twitter = require('../services/twitter.js');

exports.hashtag = function(req, res) {
    var fromTime;
    if (req.query.fromTime) {
        fromTime = req.query.fromtime;
    }
    var hashtags = req.query.hashtags.split(',');	
    twitter.getTweetsByHashtags(hashtags, fromTime, null, function(err, images) {
        if (err) {
            res.status(500);
            res.jsonp({
                error: 'Error while getting data from twitter'
            });
        } else {
            res.jsonp(images);
        }
    });
};
