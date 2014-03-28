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


  var q =  UserDoc.find({'_owner': req.user._id}).limit(1);

  if (req.query.topics) {
    console.log(req.query.topics);
    var a = req.query.topics;
    console.log(a);
    q.where('topics').all(a);
  }

   if (req.query.date) {
    q.where('updated_at').lte(req.query.date);
  }

  if (req.query.filter) {
    var f = req.query.filter;
    if (f == 'Public') {
      q.where('is_published').equals(true);
    }
    if (f == 'Private') {
      q.where('is_published').equals(false);
    }
    if (f == 'Archive') {

      q.where('is_archived').equals(true);
    } else {

      q.where('is_archived').ne(true);
    }
  }


  // if (req.query.sort) {
  //   var s = req.query.sort;

  //   console.log('sort')
  //   if (s == 'Popularity') {
  //     console.log('sort popular')

  //     q.sort('-pub_doc.score');
  //   }

  //   if (s == 'Date') {
  //     console.log('datesort')
  //     q.sort('-updated_at');
  //   }
  // }


  if (req.query.skip) {
    q.skip(req.query.skip);
  }


  q
    .sort('-updated_at')
    .populate('pub_doc')
    .populate('topics')
    .limit(50)
    .exec(function (err, docs) {
      if (err) {
        return res.send(400, err);
      }
      return res.send(200, docs)
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
    doc.body = data.body;
    doc.sample = data.sample
  }

  if (type === 'hasTitle') {
    doc.has_title = data;
  }

  if (type === 'archive') {
    doc.is_archived = data;
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

  UserDoc.findOne({ '_id' : userDocId}, function (err, doc) {

    if ( bool ) {
      doc.topics.addToSet(topicId);
      if (doc.is_published) {
        pubDocs.topic(doc.pub_doc, topicId, bool);
      }
    } else {
      doc.topics.pull(topicId);
      if (doc.is_published) {

        pubDocs.topic(doc.pub_doc, topicId, bool);
      }
    }

    doc.save(function (err,doc) {
      if (err) console.log(err);

      // res.send(200, doc);
    })




  })

}

exports.getScore = function(docId, cb) {
  UserDoc.findOne({'_id' : docId}, cb);
}