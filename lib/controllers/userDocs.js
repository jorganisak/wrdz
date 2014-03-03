'use strict';
/*

UserDoc Controller

  @load 
  @show
  @create
  @update

  */


/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  UserDoc = mongoose.model('UserDoc'),
  User = mongoose.model('User'),
  async = require('async');

var userCtrl = require('../controllers/users');


/**
 * Load userDoc
 */

exports.load = function (req, res, next, id) {
  UserDoc.load(id, function (err, doc) {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return next(new Error('not found'));
    }
    req.doc = doc;
    next();
  });
};

/**
 * Show userDoc
 */

exports.show = function (req, res) {
  res.json(200, req.doc);
};


/**
 * Create userDoc
 */

exports.create = function (req, res) {
  var userDoc = new UserDoc(req.body);
  userDoc._owner = req.user._id;


  User.update({ _id : req.user._id},
    { $set: { current_doc : userDoc._id} },
    { $push : { _userDocs : userDoc._id } },
    { upsert : true },
    function (err, data) {
      console.log(err);
    });

  userDoc.save(function (err) {
    if (err) {
      return res.send(500, err);
    }


    return res.json(201, userDoc);
  });
};



/**
 * Update a UserDoc
      three types from param query
        title
        body
        hasTitle (boolean)
        */

exports.update = function (req, res) {
  var data = req.body.data;
  var doc = req.doc;
  var type = req.query.type;

  // update date
  doc.updated_at = Date.now();

  if (type === 'title') {
    doc.title = data;
  }

  if (type === 'body') {
    doc.body = data;
  }

  if (type === 'hasTitle') {
    doc.has_title = data;
  }

  doc.save(function (err) {
    if (err) {
      return res.send(500, err);
    }
    return res.send(200, 'Saved');
  });


};


