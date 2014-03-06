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
UserDoc = mongoose.model( 'UserDoc' ),
User = mongoose.model( 'User' ),
async = require( 'async' );

var userCtrl = require( '../controllers/users' );

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

      UserDoc.update({_id: docId}, 
        {$addToSet: {'topics': topic._id }}, 
        {upsert : true}, 
        function (err) {
          if (err) {
            res.send(400, err);
          }
        }
      );

      topic.save(function (err, topic) {
        if (err) {
          res.send(400, err);
        }

        user.incTopic(topic._id);
        // var flag = false;
        
        // TO DO THIS NOT WORKING
        
        // async.eachSeries(user.topics, function (userTopic) {
        //   if (userTopic.topicId === topic._id) {
        //     userTopic.count++;
        //     flag = true;
        //   }
        // }, function (err) {
        //   console.log('callback called: ' + err);
        //   if (!flag) {
        //     console.log('psushing tag');
        //     user.topics.push({ 'topicId' : topic._id, 'count': 1});
        //   } 
        


        //   user.save(function (err) {
        //     if (err) {
        //       res.send(400, err);
        //     }
        //   })
        // })

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

      UserDoc.update({_id: docId}, 
        {$pull: {'topics': topic._id }},
        function (err) {
          if (err) {
            res.send(400, err);
          }
        }
      );

      topic.save(function (err, topic) {
        if (err) {
          res.send(400, err);
        }

        async.each(user.topics, function (userTopic) {
          if (userTopic.topicId === topic._id) {
            userTopic.count--;
            flag = true;
          }
        }, function () {
          
          user.save(function (err) {
            if (err) {
              res.send(400, err);
            }
          })
        })

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








