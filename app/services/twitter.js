'use strict';

var twit = require('twit'),
    _ = require('lodash'),
    moment = require('moment'),
    async = require('async');

var twitter = new twit({
    consumer_key: 'wVASXWImPduD7FaWNNK79iDio',
    consumer_secret: 'sm24xFOXwawVUhL8KjGI9EAyOFp2gDyqYtgOe9StstsiHuCB6n',
    access_token: '38498935-hO5kFps3kXkf3L0Yl4pbCzmS3iD9R4E7Pq5m4jqCk',
    access_token_secret: 'WzO7jAy93WfAxEO3WfZTvHw3sTB7tG7bx9pRpu9sTLOhW'
});

var getTweetsByHashtag = function(hashtag, maxTweetsPerHashtag, fromTime, lang, callback) {
    var options = {
        q: '#' + hashtag,
        count: 100
    };
    if (lang) {
        //options.lang = lang;
    }
    twitter.get('search/tweets', options, function(err, data, response) {
        if (err) {
            callback(err, null);
        } else {
            var tweets = data.statuses;
            console.log(hashtag);
            console.log(tweets.length);
            if (fromTime) {
                tweets = _.filter(tweets, function(tweet) {
                    return parseInt(moment(new Date(tweet.created_at)).format('X')) > fromTime;
                });
            }
            //Filter retweets and links and replies
            tweets = _.filter(tweets, function(tweet) {
                return tweet.text.indexOf('http') === -1 && tweet.retweeted === false && tweet.text.indexOf('@') !== 0 && tweet.text.indexOf('RT') !== 0;
            });
            console.log(tweets.length);
            if (maxTweetsPerHashtag < 100) {
                var i = 0;
                tweets = _.filter(tweets, function(tweet) {
                    i = i + 1;
                    if (i <= maxTweetsPerHashtag) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
            console.log(tweets.length);
            tweets = _.map(tweets, function(tweet) {
                return {
                    timestamp: parseInt(moment(new Date(tweet.created_at)).format('X')),
                    text: tweet.text,
                    //tags: tweet.entities.hashtags,
                    //tag: media.tags[0]
                };
            });
            callback(null, tweets);
        }
    });

};

exports.getTweetsByHashtags = function(hashtags, maxTweetsPerHashtag, fromTime, lang, callback) {
    var tagLoop = _.map(hashtags, function(hashtag) {
        return function(parallelCallback) {
            getTweetsByHashtag(hashtag, maxTweetsPerHashtag, fromTime, lang, parallelCallback);
        };
    });
    async.parallel(tagLoop, function(err, tweets) {
        if (!err) {
            tweets = _.flatten(tweets);
        }
        callback(err, tweets);
    });
};
