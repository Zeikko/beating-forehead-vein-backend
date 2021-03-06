'use strict';

var instagram = require('../services/instagram.js'),
    swig = require('swig'),
    _ = require('lodash');

exports.tag = function(req, res) {
    var fromTime;
    if (req.query.fromTime) {
        fromTime = req.query.fromtime;
    }
    var tags = req.query.tags.split(',');
    instagram.getImagesByTags(tags, 40, fromTime, function(err, images) {
        if (err) {
            res.status(500);
            res.jsonp({
                error: 'Error while getting data from instagram'
            });
        } else {
            images = _.map(images, 'thumbnail');
            res.send(swig.renderFile('app/views/images.html', {
                images: images
            }));
        }
    });
};
