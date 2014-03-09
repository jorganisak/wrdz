'use strict';

/*
  Published/Public Docs Controller

  @load
  @show
  @create
  @list (top 20 points) 
  @update
    (types) - view , up_vote , heart
*/

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  PubDoc = mongoose.model('PubDoc'),
  async = require('async');

var users = require('../controllers/users');
var userDocs = require('../controllers/userDocs');

/**
 * Load pubDoc
 */

exports.load = function (req, res, next, id) {
  PubDoc.load(id, function (err, doc) {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return next(new Error('not found'));
    }
    req.pubDoc = doc;
    next();
  });
};

/**
 * Show pubDoc
 */

exports.show = function (req, res) {
  return res.json(200, req.pubDoc);
};

/**
 * Create pubDoc
 */

exports.create = function (req, res) {
  var newDoc = {
    doc : req.body.id,
    is_anon: req.body.is_anon
  }

  if (!newDoc.is_anon) {
    newDoc.author = req.user._id;
  } 

  var pubDoc = new PubDoc(newDoc);

  users.pubDoc(req.user, pubDoc._id);
  userDocs.pubDoc(req.body.id, pubDoc._id);

  pubDoc.save(function (err) {
    if (err) {
      return res.send(500, err);
    }
    return res.json(201, pubDoc);
  });
};


/**
 * Update a pubDoc
 */

exports.update = function (req, res) {
  var data = req.body.data;
  var type = req.query.type;
  console.log(data);

  var pubDoc = req.pubDoc;
  // console.log(pubDoc);
  if (req.user) {

    if (type === 'view') {
      if (data) {
        if (!pubDoc.meta._views) {
          pubDoc.meta._views = [];
        }
        pubDoc.meta._views.push(req.user._id);
        users.addView(req.user._id, pubDoc._id);
        pubDoc.views = pubDoc.views + 1;
      } 
    }
    if (type == 'up_vote') {
      if (data) {
        if (!pubDoc.meta._views) {
          pubDoc.meta._up_votes = [];
        }
        pubDoc.meta._up_votes.addToSet(req.user._id);
        users.addUpVote(req.user._id, pubDoc._id);
        pubDoc.up_votes = pubDoc.up_votes + 1;
      } else {
        pubDoc.meta._up_votes.pull(req.user._id);
        users.removeUpVote(req.user._id, pubDoc._id);
        pubDoc.up_votes = pubDoc.up_votes - 1;
      } 
    }
    if (type == 'heart') {
      if (data) {
        if (!pubDoc.meta._hearts) {
          pubDoc.meta._hearts = [];
        }
        pubDoc.meta._hearts.addToSet(req.user._id);
        users.addHeart(req.user._id, pubDoc._id);         
        pubDoc.hearts++;
      } else {
        pubDoc.meta._hearts.pull(req.user._id);
        users.removeHeart(req.user._id, pubDoc._id);
        pubDoc.hearts--;
      } 
    } 
    pubDoc.calculateScore();
  }

  pubDoc.save(function(err, doc) {
    if (err) {
      res.send(500, err)
    }
    res.send(200, doc);
  });
};

/*
  Get top 20  
*/

exports.list = function  (req, res) {
  req.query.date;
  req.query.count;
  req.query.sort;


  var count = 20;

  var data = Date.now;



  PubDoc
    .find()
    .sort('score')
    .limit(20)
    .populate('doc', 'title has_title topics sample', null, null)
    .populate('author', 'username')
    .select('score up_votes published_at hearts author is_anon doc')
    .exec(function  (err, pubDocs) {
      if (err) {
        res.send(500, err)
      }

      return res.json(200, pubDocs);
    });
};
