'use strict';

/*
  User Controller
*/


/*
 Module dependencies.
*/

 var mongoose = require('mongoose'),
 User = mongoose.model('User'),
 passport = require('passport');

/*
  Login
*/

exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, msg) {
    if (err) {
      return res.send(err); 
    }
    if (!user) {
      return res.send(400, msg.message); 
    }

    req.logIn(user, function (err) {
      if (err) {
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

/*
  Reset Password
*/

exports.reset = function (req, res) {
  var data = req.body;
  console.log(data);
  User.findOne({'email': data.email}, function (err, user) {
    console.log(err);
    console.log(user);
    if (err) return res.send(400, err);
    if (!user) return res.send(400, 'No User With That Email');
    if (user) {
      user.password = data.password;

      user.save(function (err, user) {
        console.log(err)
        if (err) return res.send(400, err);
        req.logIn(user, function(err) {
          console.log(err)
          if (err) return res.send(201, err);
          var returnUser = user;
          req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
          return res.send(200, returnUser);
        });
      })
    }
  })

};

exports.testUsername = function (req, res) {
  User.findOne({'username': req.body.username}, function (err, user) {
    if (err) return res.send(500, err);

    if (user) {
      return res.json(200, {message: 'Username exists'})
    } else {
      return res.json(200, {message: 'Username available'})
    }
  })
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

  if (type === 'username') {
    user.username = data;
    user.save(function (err, user) {
      if (err) {
        return res.send(401, err);
      }
      return res.send(200, user);
    });
  }

};

/**
 *  Show profile
 */

exports.showFull = function (req, res) {
  var user = req.profile;
  res.json({
    user: user
  });
};


exports.showSmall = function (req, res) {
  var user = req.profile;
  user._userDocs = null;
  user.meta = null;
  user.created = null;
  user._pubDocs = null;
  res.json({
    user: user
  });
};


/**
 * Find user by id - must be authed as user
 */


 exports.load = function (req, res, next, id) {
  User
  .findOne({ _id : id })

  // Population of User fields to be used in Write view
  .select('-salt -provider -hashed_password -email -twitter.secrets')

  .populate('_userDocs', null , { is_archived : false }, 
    {sort: [['updated_at', 'desc']],limit :10, populate:['pub_doc']} )

  .exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('Failed to load User ' + id));
    }

    req.profile = user;
    next();
  });
};


// Methods to be used by other Controllers, no req or res arguments

exports.userDoc = function (userId, docId) {
  User.update({ _id : userId},
    { 
      $set: { current_doc : docId} ,
      $push : { _userDocs : docId } 
    },
    { upsert : true },
    function (err, data) {
      console.log(data);
    });
}

exports.pubDoc = function (user, docId) {
  user._pubDocs.push(docId);
  user.save(function (err) {
    if (err) {
      console.log(err);
    }
  })
}

exports.addUpVote = function (userId, docId) {
  User.findByIdAndUpdate(userId, { $addToSet: { 'meta._up_votes': docId }}, 
    function (err) {
      if (err) {
        return console.log(err);
      }
  });
}

exports.removeUpVote = function (userId, docId) {
  User.findByIdAndUpdate(userId, { $pull: { 'meta._up_votes': docId }}, 
    function (err) {
      if (err) {
        return console.log(err);
      }
  });
}

exports.addToKarma = function (userId) {
  User.findByIdAndUpdate(userId, { $inc: { 'karma': 1 }}, 
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('working!')
  });
}