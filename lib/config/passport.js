'use strict';

var mongoose = require('mongoose'),
  TwitterStrategy = require('passport-twitter').Strategy,
  GoogleStrategy = require('passport-google').Strategy,
  User = mongoose.model('User');

module.exports = function (passport) {
  // require('./initializer')
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new TwitterStrategy({
      consumerKey: 'LfXVuvdovxI3FRx9mDF8jQ',
      consumerSecret: 'yznvsGO31Xo4T6y8Zx0sEYncTK62rJDHDWdqT9rs8',
       callbackURL: "http://wrdz.co/auth/twitter/callback"
      //callbackURL: "http://localhost:9000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
     process.nextTick(function() {
          User.findOne({ 'twitter.profile.id' : profile.id }, function(err, user) {
              if (err)
                  return done(err);
              if (user) {
                return done(null, user);
              } else {
                  var user = new User();
                  user.provider = "twitter";
                  user.username = profile.displayName;
                  user.twitter.profile.id = profile.id;
                  user.twitter.profile.username = profile.username;
                  user.twitter.profile.displayName = profile.displayName;
                  user.twitter.profile.photos = profile.photos;
                  user.twitter.secrets.token = token;
                  user.twitter.secrets.tokenSecret = tokenSecret;
                  user.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, user);
                  });
              }
          });
      });
    }
  ));

  passport.use(new GoogleStrategy({
      returnURL: 'http://www.wrdz.co/auth/google/return',
      //returnURL: 'http://localhost:9000/auth/google/return',
      realm: 'http://www.wrdz.co/'
      //realm: 'http://localhost:9000/'
    },
    function(identifier, profile, done) {
     process.nextTick(function() {
          User.findOne({ 'google.id' : identifier }, function(err, user) {
              if (err)
                  return done(err);
              if (user) {
                return done(null, user);
              } else {
                  var user = new User();
                  user.username = profile.displayName;
                  user.provider = "google";
                  user.google.id = identifier;
                  user.google.displayName = profile.displayName;
                  user.google.email = profile.emails;
                  user.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, user);
                  });
              }
          });
      });
    }
  ));
};