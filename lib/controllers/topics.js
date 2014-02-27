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
 UserDoc = mongoose.model( 'Topic' ),
 User = mongoose.model( 'User' ),
 async = require( 'async' );

 var userCtrl = require( '../controllers/users' );




  if (data.type === 'add Tag') {
    var tag;
    Tag.findOne({'title': data.tag.title}, function  (err, tag) {
      if (err) res.send(400, err);

      if (tag) {
        console.log('found a tag');
        tag._docs.addToSet(data.tag._docs[0]);

      } else {
        tag = new Tag(data.tag);

      }

      UserDoc.update({_id: data.tag._docs[0]} , { $addToSet: {tags: tag._id}}, {upsert: true}, function  (err) {
        if (err) console.log(err);
      });

      tag.save(function(err, tag) {
        if (err) {
          res.send(401, err)
        }
        user.tags.addToSet(tag._id);
        user.save(function (err) {
          if (err) {
           res.send(401, err);

         }
         res.send(200, 'Saved');
       });

        res.send(200, tag)
      });
    })
  }

  if (data.type === 'removeTag') {
    Tag.update({'_id' : data.tag._id}, {$pull : {'_docs' : data.doc_id}}, function  () {

    });
    UserDoc.update({'_id' : data.doc_id}, {$pull : {'tags' : data.tag._id}}, function  () {

    })
  }

/**
 * Add Topic
 */

 exports.load = function( req, res, next, id ){
  UserDoc.load( id, function ( err, doc ) {
    if ( err ) return next( err );
    if ( !doc ) return next( new Error( 'not found' ) );
    req.doc = doc;
    next(  );
  } );
};

/**
 * Remove Topic
 */

 exports.show = function( req, res ){
  res.json( 200, req.doc );
};






/**
 * Update a UserDoc
      two types: title and body, passed in by the request
 */

 exports.update = function( req, res ) {
  var data = req.body.data;
  var id = req.param( 'userDocId' );
  var type = req.query.type;

  if ( type == 'title' ) {
    UserDoc.update( {_id : id}, 
      { $set: {'title': data,  'updated_at': Date.now(  ) }},
      function  ( err, doc ) {
        if ( err ) res.send( 400, err );
        return res.send( 200 );
      });
  }


  if ( type =='body' ) {
    UserDoc.update( {_id : id}, 
      { $set: {'body': data, 'updated_at': Date.now(  ) }}, 
      function  ( err, doc ) {
        if ( err ) res.send( 400, err );
        return res.send( 200 );
      } );
  }

  if ( type =='hasTitle' ) {
    UserDoc.update( {_id : id}, { $set: {'has_title': data , 'updated_at': Date.now(  ) }}, function  ( err, doc ) {
      if ( err ) res.send( 400, err );
      return res.send( 200 );
    } );
  }


};


