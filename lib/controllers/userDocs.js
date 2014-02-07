'use-strict';

/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 UserDoc = mongoose.model('UserDoc'),
 User = mongoose.model('User'),
 async = require('async');


/**
 * Load userDoc
 */

exports.load = function(req, res, next, id){
  UserDoc.load(id, function (err, doc) {
    if (err) return next(err);
    if (!doc) return next(new Error('not found'));
    req.doc = doc;
    next();
  });
};

/**
 * Create userDoc
 */

 exports.create = function (req, res) {
  var userDoc = new UserDoc(req.body);
  // console.log(req.body);
  UserDocs.save(function (err) {
    if (err) {
      return res.send(500, err);
    }

    return res.json(201, UserDocs);
  });
};

/**
 * Show userDoc
 */

exports.show = function(req, res){
  res.json(200, req.doc);
};


/**
 * Update a UserDocs
 */

exports.update = function(req, res) {
  var id = req.body._id;
  var newUserDoc = req.body;

  UserDocs.findById(id, function(err, UserDoc) {
    if (err) console.log(err);

    UserDoc.meta = newUserDoc.meta;

    UserDocs.save(function(err) {
      if (err) return res.send(500, err);

      return res.send(201, UserDocs);

    });
  });


};

