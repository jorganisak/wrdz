'use strict';

var path = require('path');

exports.partials = function( req, res ) {
  var stripped = req.url.split( '.' )[0];
  var requestedView = path.join(  './', stripped );
  res.render( requestedView, function( err, html ) {
    if( err ) {
      res.render( '404' );
    } else {
      res.send( html );
    }
  } );
};

exports.index = function( req, res ) {

/*
  Assigns Cookie to Client
*/

  var email = '';
  var _id = '';
  if ( req.user ) {
    email = req.user.email;
    _id   = req.user.id;
    res.cookie( 'user', JSON.stringify( {
       'email': email,
       '_id'  : _id
    }),
    {
      maxAge: 10 * 365 * 24 * 60 * 60
    }
    );
  }

  res.render( 'index' );

};
