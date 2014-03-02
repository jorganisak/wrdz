'use-strict';

/*
  User Controller

  @login
  @logout
  @update
    (types)
      @currentDoc
      @userDocs
      @addTag
      @removeTag
      */
/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 User = mongoose.model('User'),
 UserDoc = mongoose.model('UserDoc'),
 Topic = mongoose.model('Topic'),
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

  var data = req.body.data;
  
  var type = req.query.type;

  if (type === 'currentDoc') {
    user.current_doc = data;
    user.save(function (err) {
      if (err) {
        return res.send(401, err);

      }
      return res.send(200, 'Saved');
    });
  }

  if (type === 'userDocs') {
    user._userDocs.push(data);
    user.save(function (err) {
      if (err) {
        return res.send(401, err);

      }
      return res.send(200, 'Saved');
    });
  }








  
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

  // Population of User fields

  .populate('_userDocs', null , null, 
    {sort: [['updated_at', 'desc']],limit :10, populate:['topics']} )

  .populate('current_doc', null, null, {populate:['topics']})

  .populate('topics')

  .exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};