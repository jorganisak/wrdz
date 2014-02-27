'use-strict';
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

 var mongoose = require( 'mongoose' ),
 UserDoc = mongoose.model( 'UserDoc' ),
 User = mongoose.model( 'User' ),
 async = require( 'async' );

 var userCtrl = require( '../controllers/users' );


/**
 * Load userDoc
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
 * Show userDoc
 */

 exports.show = function( req, res ){
  res.json( 200, req.doc );
};


/**
 * Create userDoc
 */

 exports.create = function ( req, res ) {
  var userDoc = new UserDoc( req.body );
  userDoc._owner = req.user._id;


  User.update( { _id : req.user._id}, 
    { $push : { _userDocs : userDoc._id } }, 
    { upsert : true }, 
    function( err, data ) {} );

  userDoc.save( function ( err ) {
    if ( err ) {
      return res.send( 500, err );
    }


    return res.json( 201, userDoc );
  } );
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


