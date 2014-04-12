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

exports.hearts = function (req, res) {

  var q =  PubDoc.find({'is_visible': true});


  q
    .where('_id').in(req.body.docIds)
    .sort('-published_at')
    .limit(100)
    .populate('doc', 'title has_title sample', null, null)
    .populate('author', 'username twitter.id twitter.displayName')
    .select('score up_votes published_at hearts author is_anon doc')
    .exec(function  (err, pubDocs) {
      if (err) {
        res.send(500, err)
      }

      return res.json(200, pubDocs);
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
        console.log(pubDoc.owner);
        users.addToKarma(pubDoc._owner);
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

    var karma = req.user.karma;

    var score = calculateScore(pubDoc.published_at, pubDoc.up_votes, pubDoc.hearts, karma);
    console.log(score);
    pubDoc.score = score;
  }

  pubDoc.save(function(err, doc) {
    if (err) {
      return res.send(500, err)
    }
    return res.send(200, doc);
  });
};

function calculateScore (published_at, up_votes, hearts, karma) {
  
  var timeElapse = Date.now() - published_at;

  var sum = hearts *2 + up_votes;

  if (50000 - Math.pow((timeElapse*0.00001),5) < sum) {
    return sum;
  };



  var val = Math.round( Math.pow( Math.pow((up_votes+1), 0.4) * Math.pow((hearts+1), 0.8) * Math.pow((karma+1), 0.1) * (50000 - Math.pow((timeElapse*0.00001),5)) , 0.25) );

  return val;
};

/*
  Get top 20  
*/

exports.list = function  (req, res) {

  var q =  PubDoc.find({'is_visible': true});



  if (req.query.topics) {
    var a = [req.query.topics];
    q.where('topics').in(a);
  }

   if (req.query.following) {
    q.where('author').in(req.query.following);
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
  if (req.query.hearts) {
    var h = req.query.hearts;
    q.where('_id').in(h);
  }


  q
    .sort('-score')
    .limit(10)
    .populate('doc', 'title has_title body sample', null, null)
    .populate('author', 'username bio twitter.username website followers karma')
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