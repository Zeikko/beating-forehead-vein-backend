'use strict';

var express = require('express'),
    index = require('./app/routes/index.js'),
    nature = require('./app/routes/nature.js'),
    instagram = require('./app/routes/instagram.js'),
    twitter = require('./app/routes/twitter.js'),
    selfie = require('./app/routes/selfie.js');

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', index.get);
app.get('/images/nature.json', nature.images);
app.get('/images/selfie.json', selfie.images);
app.get('/text/nature.json', nature.text);
app.get('/instagram/tag.html', instagram.tag);
app.get('/twitter/hashtag.json', twitter.hashtag);


var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});
