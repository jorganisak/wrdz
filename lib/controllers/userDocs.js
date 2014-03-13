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
  async = require('async');

var users = require('../controllers/users');
var pubDocs = require('../controllers/pubDocs');


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

  users.userDoc(req.user._id, userDoc._id);

  userDoc.save(function (err) {
    if (err) {
      return res.send(500, err);
    }


    return res.json(201, userDoc);
  });
};

exports.list = function (req, res) {

  var dateQuery = req.query.date;

  var topicQuery = req.query.topic;

  var filterQuery = req.query.filter;

  var sortQuery = req.query.sort;



  UserDoc
    .find({ '_owner' : req.user._id})
    .where('updated_at').lte(dateQuery)
    .where('topics').in([topicQuery])
    .exec(function (err, docs) {
      if (err) {
        return res.send(400, err);
      }
      return res.send(200, docs)
    });


  
  // return res.send(200, 'Yay');


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
    doc.body = data.body;
    doc.sample = data.sample
  }

  if (type === 'hasTitle') {
    doc.has_title = data;
  }

  if (type === 'pubVisible') {
    pubDocs.switchVisible(doc.pub_doc, data);
  }

  doc.save(function (err) {
    if (err) {
      return res.send(500, err);
    }
    return res.send(200, 'Saved');
  });


};


/*
  Methods called from other controllers
*/

// set PubDoc


exports.pubDoc = function (userDocId, pubDocId) { 
  UserDoc.update({ _id : userDocId},
    { 
      $set: {is_published : true,
        pub_doc : pubDocId}
    },
    function (err, data) {
      if (err) {
        res.send(500, err)
      }
    });
}

exports.topic = function (userDocId, topicId, bool) {
  if (bool) {

        UserDoc.update({_id: userDocId}, 
        {$addToSet: {'topics': topicId }}, 
        {upsert : true}, 
        function (err) {
          if (err) {
            res.send(400, err);
          }
        }
      );
  } else {
          UserDoc.update({_id: userDocId}, 
        {$pull: {'topics': topicId }},
        function (err) {
          if (err) {
            res.send(400, err);
          }
        }
      );
  };
}