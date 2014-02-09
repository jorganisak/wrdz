'use-strict';

/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 User = mongoose.model('User'),
 passport = require('passport');

/*
    Login
    */

exports.login = function (req, res, next) {
 passport.authenticate('local', function(err, user, msg) {

  if (err) {return res.send(err); }
  if (!user) { return res.send(400, msg.message); }


  req.logIn(user, function(err) {
    if(err) {
      return next(err);
    }

    var returnUser = user;

    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
      //probabl don't send the whole user back
      res.json(200, returnUser);
    });

})(req, res, next);
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.send(200, 'Logged out now.');
};

/**
 * Update a user
 */

exports.update = function(req, res) {
  
  var user = req.profile;

  var data = req.body;
  
  if (data.type === 'current_doc_title') {
    user.current_doc.title = data.doc;
  }
  if (data.type === 'current_doc_body') {
    user.current_doc.body = data.doc;
  }
  if (data.type === 'userDocs') {
    user._userDocs.push(data.id);
  }
  user.save(function (err) {
    if (err) {
      return res.send(401, err);
    }
    return res.send(200, 'Saved');
  });
  
};

/**
 * Create user
 */

 exports.create = function (req, res) {
  var user = new User(req.body);
  console.log(user);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      return res.send(401, err);
    }

    // Manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return res.send(201, err);

      var returnUser = user;

      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;

      res.json(200, returnUser);
    });
  });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile;
  res.json({
    user: user
  });
};

/**
 * Find user by id
 */
 exports.user = function (req, res, next, id) {
  User
  .findOne({ _id : id })
  .exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};