'use-strict';
/*

Topics Controller

  @create
  @remove
  @update

*/

/**
 * Module dependencies.
 */

var mongoose = require( 'mongoose' ),
Topic = mongoose.model( 'Topic' ),
async = require( 'async' );

var users = require( '../controllers/users' );
var userDocs = require( '../controllers/userDocs' );

/*
  Update Topic // add or remove from doc, creates if there is none
*/
exports.update = function (req, res) {
  var topicTitle = req.body.topic // just title string
  var docId = req.body.docId
  var type = req.query.type;
  var user = req.user;



// type : 'add' or 'remove'

// data = { 'tagId' , 'docId' }
  if (type === 'add') {
    Topic.findOne({'title' : topicTitle}, function (err, topic) {
      if (err) {
        res.send(400, err);
      }

      if (topic) {
        topic._docs.addToSet(docId);
      } else {
        data = { 'title' : topicTitle, '_docs' : [docId] };
        topic = new Topic(data);
      }

      userDocs.topic(docId, topic._id, true)

      topic.save(function (err, topic) {
        if (err) {
          res.send(400, err);
        }

        users.topic(user, topic, true);

        res.send(200, topic);
      })
    });
  }
  if (type === 'remove') {
    Topic.findOne({'title' : topicTitle}, function (err, topic) {
      if (err) {
        res.send(400, err);
      }

      if (topic) {
        topic._docs.pull(docId);
      } 

      userDocs.topic(docId, topic._id, false)


      topic.save(function (err, topic) {
        if (err) {
          res.send(400, err);
        }

        users.topic(user, topic, false);

        res.send(200, topic);
      })
    });
  }
};


/**
 * Load Topic
 */

 exports.load = function( req, res, next, id ){
  Topic.load(id, function (err, topic) {
    if (err) return next(err);
    if (!topic) return next(new Error('not found'));
    req.topic = topic;
    next();
  } );
};

/**
 * Show PubDocs with Topic
 */

 exports.show = function(req, res){
  res.json(200, req.topic);
};








