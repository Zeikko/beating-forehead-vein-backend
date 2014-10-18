'use strict';

var instagram = require('../services/instagram.js'),
    twitter = require('../services/twitter.js');

exports.images = function(req, res) {
    var fromTime;
    if (req.query.fromTime) {
        fromTime = req.query.fromtime;
    }
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
    ], 3, fromTime, function(err, images) {
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
