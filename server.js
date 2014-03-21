'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path'),
    passport = require('passport'),
    fs = require('fs');

var app = express();

// Connect to database
var db = require('./lib/db/mongo');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});


// Passport configuration
require('./lib/config/passport')(passport);

// Express Configuration
require('./lib/config/express')(app, passport, db);


// Bootstrap routes
require('./lib/config/routes')(app, passport);

// Bootstrap forgot password
require('./lib/config/forgot_password.js')(app, express);




var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});


// Expose app
exports = module.exports = app;