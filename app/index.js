'use strict';

var express = require('express'),
	index = require('./routes/index.js'),
	nature = require('./routes/nature.js'),
	instagram = require('./routes/instagram.js');

var app = express();

app.get('/', index.get);
app.get('/images/nature.json', nature.json);
app.get('/instagram/tag.html', instagram.tag);

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);

});