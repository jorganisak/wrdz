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

// TODO parse out what should not get sent to client
exports.show = function (req, res) {
  if (req.pubDoc.is_visible) {

    req.pubDoc._owner = null
    req.pubDoc.meta = null

    return res.json(200, req.pubDoc);
  }
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

  newDoc._owner = req.user._id;

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
 * Update - lots to refactor
 */

exports.update = function (req, res) {
  var data = req.body.data;
  var type = req.query.type;

  var pubDoc = req.pubDoc;

  if (req.user) {

    if (type == 'up_vote') {
      if (data) {
        if (!pubDoc.meta._up_votes) {
          pubDoc.meta._up_votes = [];
        }
        // TODO : SLAE
        pubDoc.meta._up_votes.addToSet(req.user._id);
        users.addUpVote(req.user._id, pubDoc._id);
        pubDoc.up_votes = pubDoc.up_votes + 1;
        users.addToKarma(pubDoc._owner);
      } else {
        pubDoc.up_votes = pubDoc.up_votes - 1;
        users.removeUpVote(req.user._id, pubDoc._id);
        pubDoc.meta._up_votes.pull(req.user._id);
      } 
    }

    var karma = req.user.karma;

    var score = calculateScore(pubDoc.published_at, pubDoc.up_votes, karma);

    pubDoc.score = score;
  }

  pubDoc.save(function(err, doc) {
    if (err) {
      return res.send(500, err)
    }
    return res.send(200, doc);
  });
};

/*
  Calculate score for post, triggered on up_vote
*/
function calculateScore (published_at, up_votes, karma) {
  
  var timeElapse = Date.now() - published_at;

  var sum = up_votes;

  if (50000 - Math.pow((timeElapse*0.00001),5) < sum) {
    return sum;
  };

  var val = Math.round( Math.pow( Math.pow((up_votes+1), 0.4) * Math.pow((karma+1), 0.1) * (50000 - Math.pow((timeElapse*0.00001),5)) , 0.25) );

  return val;
};

/*
  List - includes query parameters
*/

exports.list = function  (req, res) {

  var q =  PubDoc.find({'is_visible': true});

  // this will change with infinite scroll
  if (req.query.skip) {
    q.skip(req.query.skip);
  }

  if (req.query.user) {
    q.where('author').equals(req.query.user);
  }


  if (req.query.sort) {
    var s = req.query.sort;
    if (s === "score") {
      q.sort('-score')
    }
    if (s === "time") {
      q.sort('-published_at');
    }
  }

  q
    .limit(10)
    .populate('doc', 'body', null, null)
    .populate('author', 'username twitter.username')
    .populate('topics')
    .select('score up_votes published_at author is_anon doc')
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