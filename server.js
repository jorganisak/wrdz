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




var forgot = require('password-reset-nodemailer')({
    uri : 'http://localhost:8080/password_reset',
    from: 'password-robot@localhost',
    transportType: 'SMTP',
    transportOptions: {
      service: "Gmail",
      auth: {
        user: "jorganisak@gmail.com",
        pass: "dog1fish"
      }
    }
});
app.use(forgot.middleware);

app.post('/forgot', express.bodyParser(), function (req, res) {
    var email = req.body.email;
    var reset = forgot(email, function (err) {
        if (err) res.end('Error sending message: ' + err)
        else res.end('Check your inbox for a password reset message.')
    });

    reset.on('request', function (req_, res_) {
        req_.session.reset = { email : email, id : reset.id };
        fs.createReadStream(__dirname + '/forgot.html').pipe(res_);
    });
});

app.post('/reset', express.bodyParser(), function (req, res) {
    if (!req.session.reset) return res.end('reset token not set');

    var password = req.body.password;
    var confirm = req.body.confirm;
    if (password !== confirm) return res.end('passwords do not match');

    // update the user db here

    forgot.expire(req.session.reset.id);
    delete req.session.reset;
    res.end('password reset');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});


// Expose app
exports = module.exports = app;