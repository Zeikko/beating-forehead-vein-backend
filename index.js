'use strict';

var express = require('express'),
    index = require('./app/routes/index.js'),
    nature = require('./app/routes/nature.js'),
    instagram = require('./app/routes/instagram.js'),
    twitter = require('./app/routes/twitter.js'),
    selfie = require('./app/routes/selfie.js'),
    sibelius = require('./app/routes/sibelius.js'),
    collection = require('./app/routes/collection.js'),
    nodeCache = require('node-cache');

var app = express();

var cache = new nodeCache();

app.use(express.static(__dirname + '/public'));

app.get('/', index.get);
app.get('/images/nature.json', nature.images);
app.get('/images/selfie.json', selfie.images);
app.get('/images/sibelius.json', sibelius.images);
app.get('/text/nature.json', nature.text);
app.get('/instagram/tag.html', instagram.tag);
app.get('/twitter/hashtag.json', twitter.hashtag);
app.get('/images/collection.json', function(req, res) {
    collection.images(req, res, cache);
});
app.get('/text/collection.json', function(req, res) {
    collection.text(req, res, cache);
});

var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});
