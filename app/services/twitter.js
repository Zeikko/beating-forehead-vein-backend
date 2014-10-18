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

var getTweetsByHashtag = function(hashtag, sort, fromTime, lang, callback) {
    var options = {
        q: '#' + hashtag,
        count: 100
    };
    if (lang) {
        options.lang = lang;
    }
    twitter.get('search/tweets', options, function(err, data, response) {
        if (err) {
            callback(err, null);
        } else {
            var tweets = data.statuses;
            if (fromTime) {
                tweets = _.filter(tweets, function(tweet) {
                    return parseInt(moment(new Date(tweet.created_at)).format('X')) > fromTime;
                });
            }
            //Filter retweets and links and replies
            tweets = _.filter(tweets, function(tweet) {
                return tweet.text.indexOf('http') === -1 && tweet.retweeted === false && tweet.text.indexOf('@') !== 0 && tweet.text.indexOf('RT') !== 0;
            });
            tweets = _.map(tweets, function(tweet) {
                return {
                    timestamp: parseInt(moment(new Date(tweet.created_at)).format('X')),
                    text: tweet.text,
                    sort: sort,
                    hashtag: hashtag
                };
            });
            callback(null, tweets);
        }
    });

};

exports.getTweetsByHashtags = function(hashtags, maxTweets, fromTime, lang, callback) {
    var i = 0;
    var tagLoop = _.map(hashtags, function(hashtag) {
        i = i + 1;
        var sort = i;
        return function(parallelCallback) {
            getTweetsByHashtag(hashtag, sort, fromTime, lang, parallelCallback);
        };
    });
    async.parallel(tagLoop, function(err, tweets) {
        if (!err) {
            var filteredTweets = [];
            var hashtagId = 0;
            var tweetId = 0;
            while (filteredTweets.length < maxTweets && tweetId <= 100) {
                if (typeof tweets[hashtagId][tweetId] !== 'undefined') {
                    filteredTweets.push(tweets[hashtagId][tweetId]);
                }
                hashtagId = hashtagId + 1;
                if (hashtagId >= tweets.length) {
                    hashtagId = 0;
                    tweetId = tweetId + 1;
                }
            }
            filteredTweets = _.sortBy(filteredTweets, 'sort');
            filteredTweets = _.map(filteredTweets, function(tweet) {
                return {
                    timestamp: tweet.timestamp,
                    text: tweet.text,
                    hashtag: tweet.hashtag
                };
            });
        }
        callback(err, filteredTweets);
    });
};
