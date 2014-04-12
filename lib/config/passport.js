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
      consumerKey: 'LfXVuvdovxI3FRx9mDF8jQ',
      consumerSecret: 'yznvsGO31Xo4T6y8Zx0sEYncTK62rJDHDWdqT9rs8',
      callbackURL: "http://localhost:9000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
     process.nextTick(function() {
          User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
              if (err)
                  return done(err);

        // if the user is found then log them in
              if (user) {

                    user.twitter.secrets = {};
                    user.twitter.secrets.token = token;
                    user.twitter.secrets.tokenSecret = tokenSecret;
                    user.save(function (err) {
                      if (err)
                        throw err;
                      console.log("doing this")
                      return done(null, user);
                    })
                 
              } else {
                  // if there is no user, create them
                  var newUser                 = new User();

          // set all of the user data that we need
                  newUser.provider = "twitter";
                  newUser.twitter.id  = profile.id;
                  newUser.twitter.username    = profile.username;
                  newUser.twitter.displayName = profile.displayName;
                  newUser.username    = profile.username;

                    newUser.twitter.secrets = {};
                    newUser.twitter.secrets.token = token;
                    newUser.twitter.secrets.tokenSecret = tokenSecret;

          // save our user into the database
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }
          });
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