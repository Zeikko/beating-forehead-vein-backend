'use strict';

var instagram = require('../services/instagram.js'),
    twitter = require('../services/twitter.js');

exports.images = function(req, res, cache) {
    var fromTime;
    if (req.query.fromTime) {
        fromTime = req.query.fromtime;
    }
    var cacheKey = 'collection-images' + fromTime;
    cache.get(cacheKey, function(err, value) {
        if (typeof value[cacheKey] !== 'undefined') {
            res.jsonp(value[cacheKey]);
        } else {
            instagram.getImagesByTags([
                'meitsie',
                'viski',
                'stubbselfie',
                'ylevero',
                'venäjä',
                'velkatakuut',
                'maakaasu',
                'putin',
                'kehäkolme',
                'susiraja',
                'pirkanmaa',
                'alibi',
                'julkinensektori',
                'virkamies',
                'säännöstely',
                'kontrolli',
                'suomettuminen'
            ], 6, fromTime, function(err, images) {
                if (err) {
                    console.log(err.message);
                    res.status(500);
                    res.jsonp({
                        error: 'Error while getting data from instagram'
                    });
                } else {
                    var response = {
                        count: images.length,
                        images: images
                    };
                    cache.set(cacheKey, response, 3 * 180, function() {
                        res.jsonp(response);
                    });
                }
            });
        }
    });
};

exports.text = function(req, res, cache) {
    var fromTime;
    if (req.query.fromTime) {
        fromTime = req.query.fromtime;
    }
    var cacheKey = 'collection-text' + fromTime;
    cache.get(cacheKey, function(err, value) {
        if (typeof value[cacheKey] !== 'undefined') {
            res.jsonp(value[cacheKey]);
        } else {
            twitter.getTweetsByHashtags([
                'suomi',
                'helsinki',
                'tampere',
                'bbsuomi',
                'vainelämää',
                'huuhkajat',
                'liiga',
                'politiikka',
                'viski',
                'olut',
                'ylevero',
                'anteeksi',
                'a2ilta',
                'venäjä',
                'susiraja',
                'pirkanmaa',
                'alibi',
                'julkinensektori',
                'virkamies'
            ], 30, fromTime, 'fi', function(err, tweets) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.jsonp({
                        error: 'Error while getting data from twitter'
                    });
                } else {
                    var response = {
                        count: tweets.length,
                        tweets: tweets
                    };
                    cache.set(cacheKey, response, 3 * 180, function() {
                        res.jsonp(response);
                    });
                }
            });
        }
    });
};
