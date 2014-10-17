'use strict';

var instagram = require('../instagram.js');

exports.get = function (req, res) {
  instagram.nature(function (images) {
  	res.jsonp(images);
  }); 
};