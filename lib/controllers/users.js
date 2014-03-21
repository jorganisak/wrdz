'use strict';

/*
  User Controller
  
  // Auth 
  @login
  @logout

  // Changes
  @update
    (types)
      @currentDoc
      @userDocs

      */
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

  User.findOne({'email': data.email}, function (err, user) {
    if (err) return res.send(400, err);
    if (!user) return res.send(400, 'No User With That Email');
    if (user) {
      user.password = data.password;

      user.save(function (err, user) {
        if (err) return res.send(400, err);
        req.logIn(user, function(err) {
          if (err) return res.send(201, err);
          var returnUser = user;
          req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
          return res.send(200, returnUser);
        });
      })
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

  if (type === 'bio') {
    user.bio = data;
    user.save(function (err) {
      if (err) {
        return res.send(401, err);
      }
      return res.send(200, 'Saved');
    });
  }

  if (type === 'addFollowing') {
    if (data.bool) {

      user.following.push(data.userId);

      User.findByIdAndUpdate(data.userId, { $inc: { 'followers': 1 }}, 
        function (err) {
          if (err) {
            return console.log(err);
          }
      });
    } else {
      user.following.pull(data.userId);
      User.findByIdAndUpdate(data.userId, { $inc: { 'followers': -1 }}, 
        function (err) {
          if (err) {
            return console.log(err);
          }
      });
    }
    user.save(function (err) {
      if (err) {
        return res.send(401, err);
      }
      return res.send(200, 'Saved');
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

/**
 * Find user by id
 */


 exports.user = function (req, res, next, id) {
  User
  .findOne({ _id : id })

  // Population of User fields to be used in Write view

  .populate('_userDocs', null , null, 
    {sort: [['updated_at', 'desc']],limit :10, populate:['topics', 'pub_doc']} )

  .populate('current_doc', null, null, {populate:['topics', 'pub_doc']})
  .populate('following', 'username')

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

exports.addHeart = function (userId, docId) {
  User.findByIdAndUpdate(userId, { $addToSet: { 'meta._hearts': docId }}, 
    function (err) {
      if (err) {
        return console.log(err);
      }
  });
}

exports.removeHeart = function (userId, docId) {
  User.findByIdAndUpdate(userId, { $pull: { 'meta._hearts': docId }}, 
    function (err) {
      if (err) {
        return console.log(err);
      }
  });
}

exports.addRepost = function (userId, docId) {
  User.findByIdAndUpdate(userId, { $addToSet: { 'meta._reposts': docId }}, 
    function (err) {
      if (err) {
        return console.log(err);
      }
  });
}

exports.removeRepost = function (userId, docId) {
  User.findByIdAndUpdate(userId, { $pull: { 'meta._reposts': docId }}, 
    function (err) {
      if (err) {
        return console.log(err);
      }
  });
}

exports.addView = function (userId, docId) {
  User.findByIdAndUpdate(userId, { $addToSet: { 'meta._views': docId }}, 
    function (err) {
      if (err) {
        return console.log(err);
      }
  });
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


exports.topic = function (user, topic, bool) {

    var flag = true;
    for (var i = 0 ; i < user.topics.length ; i++ ) {
      var str1 = String(user.topics[i].topicId);
      var str2 = String(topic._id);
      if (str1 === str2) {
        console.log('found match');
        if (bool) user.topics[i].count++;
        else user.topics[i].count--;
        flag = false;
      }
    }

    if (flag && bool) {
      console.log('pushing topic!');
      user.topics.push({'topicId':topic._id, 'count':1, 'title':topic.title})
    }

    user.save(function (err) {
    })

}
