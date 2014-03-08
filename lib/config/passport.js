'use strict';

var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  User = mongoose.model('User');


module.exports = function (passport) {
  // require('./initializer')


  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });
  

  passport.use(new TwitterStrategy({
      consumerKey: 'Mr7Ne8GYuK3M2HrE1MREnw',
      consumerSecret: 'znRusgWSbIRgxrLv2VngVSSLXgunXbduBtndNZUrtQ',
      callbackURL: "http://localhost:9000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
        console.log('Twitter auth');
      User.findOrCreate({twitterId: profile.id}, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      });
    }
  ));
  
  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
      });
    }
  ));
};