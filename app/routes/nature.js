'use strict';

var instagram = require('../services/instagram.js'),
    twitter = require('../services/twitter.js');

exports.images = function(req, res) {
    var fromTime;
    if (req.query.fromTime) {
        fromTime = req.query.fromtime;
    }
    instagram.getImagesByTags([
    	'järvi',
    	'luonto',
        'metsä',
        'talvi',
        'sieni',
        'maisema',
        'meri',
        'pelto'
    ], 40, fromTime, function(err, images) {
        if (err) {
            res.status(500);
            res.jsonp({
                error: 'Error while getting data from instagram'
            });
        } else {
            res.jsonp({
                count: images.length,
            	images: images
            });
        }
    });
};


exports.text = function(req, res) {
    var fromTime;
    if (req.query.fromTime) {
        fromTime = req.query.fromtime;
    }
    twitter.getTweetsByHashtags([
        'järvi',
        'luonto',
        'metsä',
        'talvi',
        'sieni',
        'ainola'
    ], fromTime, 'fi', function(err, tweets) {
        if (err) {
            res.status(500);
            res.jsonp({
                error: 'Error while getting data from instagram'
            });
        } else {
            res.jsonp({
                tweets: tweets
            });
        }
    });
};