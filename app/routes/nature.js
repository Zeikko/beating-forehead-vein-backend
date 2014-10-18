'use strict';

var instagram = require('../services/instagram.js'),
    moment = require('moment');

exports.json = function(req, res) {
    var fromTime;
    if (req.query.fromTime) {
        fromTime = req.query.fromtime;
    } else {
        fromTime = moment(new Date()).subtract(1, 'hour').format('X');
    }
    instagram.getImagesByTags([
    	'järvi',
    	'luonto',
        'metsä',
        'talvi',
        'sieni',
        'ainola'
    ], fromTime, function(err, images) {
        if (err) {
            res.status(500);
            res.jsonp({
                error: 'Error while getting data from instagram'
            });
        } else {
            res.jsonp({
            	images: images
            });
        }
    });
};