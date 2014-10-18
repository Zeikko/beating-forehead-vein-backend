'use strict';

var twit = require('twit'),
    _ = require('lodash'),
    moment = require('moment');

var twitter = new twit({
    consumer_key: 'wVASXWImPduD7FaWNNK79iDio',
    consumer_secret: 'sm24xFOXwawVUhL8KjGI9EAyOFp2gDyqYtgOe9StstsiHuCB6n',
    access_token: '38498935-hO5kFps3kXkf3L0Yl4pbCzmS3iD9R4E7Pq5m4jqCk',
    access_token_secret: 'WzO7jAy93WfAxEO3WfZTvHw3sTB7tG7bx9pRpu9sTLOhW'
});

exports.getTweetsByHashtags = function(hashtag, fromTime, callback) {
    twitter.get('search/tweets', {
        q: 'metsä'
    }, function(err, data, response) {
        console.log(data);
        if (err) {
            callback(err, null);
        } else {
        	var tweets = data.statuses;
            if (fromTime) {
                tweets = _.filter(tweets, function(tweet) {
                    return parseInt(moment(tweet.created_at).format('X')) > fromTime;
                });
            }
            tweets = _.map(tweets, function(tweet) {
                return {
                    timestamp: parseInt(moment(tweet.created_at).format('X')),
                    text: tweet.text,
                    //tags: tweet.entities.hashtags,
                    //tag: media.tags[0]
                };
            });
            callback(null, tweets);
        }
    });

};
