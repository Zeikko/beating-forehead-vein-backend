'use strict';

var instagram = require('../instagram.js');

exports.get = function(req, res) {
	var fromTime;
	if(req.query.fromTime) {
		fromTime = req.query.fromTime;
	}
    instagram.nature(fromTime, function(err, images) {
        if (err) {
            res.status(500);
            res.jsonp({
                error: 'Error while getting data from instagram'
            });
        } else {
            res.jsonp(images);
        }
    });
};
