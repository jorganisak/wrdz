'use-strict';

/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 User = mongoose.model('User'),
 UserDoc = mongoose.model('UserDoc'),
 Tag = mongoose.model('Tag'),
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
  
  // Pushed from Write Factory
  if (data.type === 'current_doc') {
    user.current_doc = data.docId;
    user.save(function (err) {
      if (err) {
        return res.send(401, err);

      }
      return res.send(200, 'Saved');
    });
  }

  if (data.type === 'userDocs') {
    user._userDocs.push(data.id);
    user.save(function (err) {
      if (err) {
        return res.send(401, err);

      }
      return res.send(200, 'Saved');
    });
  }

  if (data.type === 'addTag') {
    var tag;
    Tag.findOne({'title': data.tag.title}, function  (err, tag) {
      if (err) res.send(400, err);

      if (tag) {
        console.log('found a tag');
        tag._docs.addToSet(data.tag._docs[0]);

      } else {
        tag = new Tag(data.tag);

      }

      UserDoc.update({_id: data.tag._docs[0]} , { $addToSet: {tags: tag._id}}, {upsert: true}, function  (err) {
        if (err) console.log(err);
      });

      tag.save(function(err, tag) {
        if (err) {
          res.send(401, err)
        }
        user.tags.addToSet(tag._id);
        user.save(function (err) {
          if (err) {
           res.send(401, err);

         }
         res.send(200, 'Saved');
       });

        res.send(200, tag)
      });
    })
  }

  if (data.type === 'removeTag') {
    Tag.update({'_id' : data.tag._id}, {$pull : {'_docs' : data.doc_id}}, function  () {
      
    });
    UserDoc.update({'_id' : data.doc_id}, {$pull : {'tags' : data.tag._id}}, function  () {
      
    })
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
  .populate('_userDocs', null , null, {sort: [['updated_at', 'desc']],limit :10, populate:['tags']} )
    // options: {limit: 5, sort: 'updated_at'},
    // select: 'title'

  // })
.populate('current_doc', null, null, {populate:['tags']})
.populate('tags')
.exec(function (err, user) {
  if (err) return next(err);
  if (!user) return next(new Error('Failed to load User ' + id));
  req.profile = user;
  next();
});
};