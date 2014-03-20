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
var topics = require('../controllers/topics');

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

// TODO parse out what should not get sent to client
exports.show = function (req, res) {
  if (req.pubDoc.is_visible) {

    return res.json(200, req.pubDoc);
  }
};

/**
 * Create pubDoc
 */

exports.create = function (req, res) {
  console.log(req.body);
  var newDoc = {
    doc : req.body.id,
    is_anon: req.body.is_anon,
    topics: req.body.topics
  }

  if (!newDoc.is_anon) {
    newDoc.author = req.user._id;
  } 

  var pubDoc = new PubDoc(newDoc);

  users.pubDoc(req.user, pubDoc._id);
  userDocs.pubDoc(req.body.id, pubDoc._id);

  pubDoc.save(function (err) {
    if (err) {
      console.log(err);
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

  var pubDoc = req.pubDoc;

  if (req.user) {

    if (type === 'view') {
      if (data) {
        if (!pubDoc.meta._views) {
          pubDoc.meta._views = [];
        }
        pubDoc.meta._views.push(req.user._id);
        users.addView(req.user._id, pubDoc._id);
        pubDoc.views++;
      } 
    }
    if (type == 'up_vote') {
      if (data) {
        if (!pubDoc.meta._up_votes) {
          pubDoc.meta._up_votes = [];
        }

        pubDoc.meta._up_votes.addToSet(req.user._id);
        users.addUpVote(req.user._id, pubDoc._id);
        pubDoc.up_votes = pubDoc.up_votes + 1;
      } else {
        pubDoc.up_votes = pubDoc.up_votes - 1;
        users.removeUpVote(req.user._id, pubDoc._id);
        pubDoc.meta._up_votes.pull(req.user._id);
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
      console.log(err);
      return res.send(500, err)
    }
    console.log(doc);
    return res.send(200, doc);
  });
};

/*
  Get top 20  
*/

exports.list = function  (req, res) {

  var q =  PubDoc.find({'is_visible': true});



  if (req.query.topics) {
    console.log(req.query.topics);
    var a = [req.query.topics];
    console.log(a);
    q.where('topics').in(a);
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
  }

  if (req.query.skip) {
    q.skip(req.query.skip);
  }


  q
    .sort('score')
    .limit(20)
    .populate('doc', 'title has_title sample', null, null)
    .populate('author', 'username')
    .populate('topics')
    .select('score up_votes published_at hearts author is_anon doc')
    .exec(function  (err, pubDocs) {
      if (err) {
        res.send(500, err)
      }

      return res.json(200, pubDocs);
    });
};





/*
  Other controller methods
*/

exports.switchVisible = function (id, bool) {
  PubDoc.findByIdAndUpdate(id, { $set: {'is_visible' : bool}}, function (err, doc) {
    if (err) return err;
    return doc;
  })  
}

exports.getScore = function(docId, cb) {
  PubDoc.findOne({ '_id' : docId }, cb)
}


exports.topic = function (pubDocId, topicId, bool) {

  PubDoc.findOne({ '_id' : pubDocId}, function (err, doc) {

    if ( bool ) {
      doc.topics.addToSet(topicId);
      if (doc.is_published) {

      }
    } else {
      doc.topics.pull(topicId);
      if (doc.is_published) {

      }
    }

    doc.save(function (err,doc) {
      if (err) console.log(err);

      // res.send(200, doc);
    })

  })

}