'use strict';

var twit = require('twit'),
    _ = require('lodash'),
    moment = require('moment'),
    async = require('async'),
    Entities = require('html-entities').XmlEntities;

var entities = new Entities();

var twitter = new twit({
    consumer_key: process.env.twitter_consumer_key,
    consumer_secret: process.env.twitter_consumer_secret,
    access_token: process.env.twitter_access_token,
    access_token_secret: process.env.twitter_access_token_secret,
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
                    text: entities.decode(tweet.text),
                    sort: sort,
                    hashtag: hashtag,
                    id: tweet.id
                };
            });
            callback(null, tweets);
        }
    });

};

exports.getTweetsByHashtags = function(hashtags, maxTweets, fromTime, lang, callback) {
    var i = 0;
    var filteredTweets = [];
    var tagLoop = _.map(hashtags, function(hashtag) {
        i = i + 1;
        var sort = i;
        return function(parallelCallback) {
            getTweetsByHashtag(hashtag, sort, fromTime, lang, parallelCallback);
        };
    });
    async.parallel(tagLoop, function(err, tweets) {
        if (!err) {
            var hashtagId = 0;
            var tweetId = 0;
            var addedTweetIds = [];
            while (filteredTweets.length < maxTweets && tweetId <= 100) {
                if (typeof tweets[hashtagId][tweetId] !== 'undefined' && addedTweetIds.indexOf(tweets[hashtagId][tweetId].id) === -1) {
                    filteredTweets.push(tweets[hashtagId][tweetId]);
                    addedTweetIds.push(tweets[hashtagId][tweetId].id);
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
