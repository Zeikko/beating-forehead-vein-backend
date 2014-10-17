'use strict'

var express = require('express'),
	index = require('./routes/index.js');

var app = express();

app.get('/', index.get);

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);

});