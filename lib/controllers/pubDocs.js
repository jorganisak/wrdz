'use-strict';

/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 PubDoc = mongoose.model('PubDoc'),
 User = mongoose.model('User'),
 async = require('async');


/**
 * Load pubDoc
 */

 exports.load = function(req, res, next, id){
  PubDoc.load(id, function (err, doc) {
    if (err) return next(err);
    if (!doc) return next(new Error('not found'));
    req.pubDoc = doc;
    next();
  });
};

/**
 * Show pubDoc
 */

 exports.show = function(req, res){
  return res.json(200, req.pubDoc);
};

/**
 * Create pubDoc
 */

 exports.create = function (req, res) {
  console.log(req.body);
  var pubDoc = new PubDoc(req.body);

  User.update({ _id : req.user._id}, {$push : { _pubDocs : pubDoc._id}}, { upsert : true }, function(err, data) {});



  pubDoc.save(function (err) {
    if (err) {
      console.log(err)
      return res.send(500, err);
    }


    return res.json(201, pubDoc);
  });
};

/*
  Get top 20  
*/

exports.list = function  (req, res) {
  PubDoc
    .find()
    .sort('score')
    .limit(20)
    .select('title score up_votes published_at hearts author is_anon')
    .exec(function  (err, pubDocs) {
      if (err) return res.send(500, 'Could not load docs');

      return res.json(200, pubDocs);
    });
};

/**
 * Update a pubDoc
 */

exports.update = function(req, res) {
  var data = req.body
  var type = data.type;

  var pubDoc = req.pubDoc;
  // console.log(pubDoc);
  
    if (type == 'view') {
      if (req.user) {
        if (!pubDoc.meta._views) pubDoc.meta._views = [];
        pubDoc.meta._views.addToSet(req.user._id);
        User.findByIdAndUpdate(req.user._id, { $addToSet: { 'meta._views': pubDoc._id }}, function (err) {
          if (err) return console.log(err);
        });
      } 
      pubDoc.views = pubDoc.views + 1;
    }
    if (type == 'up_vote') {
      if (req.user) {
        if (!pubDoc.meta._up_votes) pubDoc.meta._up_votes = [];
        pubDoc.meta._up_votes.addToSet(req.user._id);
        User.findByIdAndUpdate(req.user._id, { $addToSet: {'meta._up_votes': pubDoc._id }}, function (err) {
          if (err) return console.log(err);
        });

      } 
      pubDoc.up_votes = pubDoc.up_votes + 1;
    }
    if (type == 'heart') {
      if (req.user) {
        if (!pubDoc.meta._hearts) pubDoc.meta._hearts = [];
        pubDoc.meta._hearts.addToSet(req.user._id);
        User.findByIdAndUpdate(req.user._id, { $addToSet: { 'meta._hearts': pubDoc._id }}, function (err) {
          if (err) return console.log(err);
        });
      } 
      pubDoc.hearts = pubDoc.hearts + 1;
    }

    pubDoc.calculateScore();



    pubDoc.save(function(err) {
      if (err) console.log(err);

      res.send("Saved");

    });
};

// /**
//  * Get all pubDocs from a user
//  */

//  exports.findAll = function (req, res) {
//   var userId = req.user._id.toString();
//   var noteIds = req.user.notes;
//   var notes = [];

//   function findAllNotes(id, cb) {
//     Note.findById(id, function(err, note) {
//       if (err) return res.send(err);

//       for (var i =0; i < note.data.owners.length; i++) {
//         if (note.data.owners[i] == userId) {
//           notes.push(note);
//         } else {
//           console.log('Not Authorized!!');
//         }
//       }
//       cb();
//     });
//   }

//   async.each(noteIds, findAllNotes, function(err) {
//     return res.json(notes);
//   });


// };