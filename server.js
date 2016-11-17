'use strict'

var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var watch = require('watch');

var app = express()
var publicDir = path.join(__dirname, '/public')


app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) //parses json, multi-part (file), url-encoded

app.use(express.static('elements'));
app.use(express.static('node_modules'));
app.use(express.static('bower_components'));
app.use(express.static('public'));


app.get('/', function(req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})




var server = http.createServer(app)

// Reload code here
var reloadServer = reload(server, app)

server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port'));
});


let watchOptions = {};
watchOptions.interval = 0.5;
watchOptions.wait = 0.5;

watch.watchTree(__dirname, watchOptions, (f, curr, prev) => {
    // Fire server-side reload event
    console.log('------------------------- CHANGES: RELOADING')
    reloadServer.reload();
});

