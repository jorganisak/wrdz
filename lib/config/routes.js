'use strict';

/**
 * Module dependencies.
 */
 var async = require('async');
 var crypto = require('crypto');

//Controllers
 var users = require('../controllers/users'),
  userDocs = require('../controllers/userDocs'),
  pubDocs = require('../controllers/pubDocs'),
  topics = require('../controllers/topics'),
  feedback = require('../controllers/feedbacks'),
  twitter = require('../controllers/twitter'),
  auth = require('./middlewares/authorization'),
  passport = require('passport'),
  index = require('../controllers');


/**
 * ROUTES
 */

 module.exports = function (app, passport) {
  // feedback
  app.post('/feedback', feedback.create);

/*
  Picture routes
*/

app.post('/twitterPic', twitter.postPic)
app.post('/shortenUrl', twitter.shortenUrl)
app.post('/twitterNoPic', twitter.noPic)

/*
  User Docs Routes
*/
  app.param('userDocId', userDocs.load);
  app.post('/userDocs', auth.requiresLogin, userDocs.create);
  app.get('/userDocs', auth.requiresLogin, userDocs.list);
  app.get('/userDocs/:userDocId', auth.requiresLogin, auth.userDoc.hasAuthorization, userDocs.show);
  app.post('/userDocs/:userDocId', auth.requiresLogin, auth.userDoc.hasAuthorization, userDocs.update);


/*
  Topic Routes
*/
  app.param('topicId', topics.load);
  // gets the top topics for read view (possible query options)
  app.get('/topics', topics.list); 
  
  // // gets pubDocs from a certain topic
  // app.get('/topics/:topicId', topics.show); 
  
  // comes from user when creating a doc (queries gallore)
  app.post('/topics', auth.requiresLogin, topics.update);


/*
  Public Doc routes
*/

  app.param('pubDocId', pubDocs.load); // id param
  
  // queries (date, count, sort, )
  app.get('/pubDocs', pubDocs.list); 
  app.post('/pubDocs/hearts', pubDocs.hearts); 
  app.get('/pubDocs/:pubDocId', pubDocs.show);

  app.post('/pubDocs', auth.requiresLogin, pubDocs.create);

  // queries ( type (
  //  view, up_vote, heart,
  // pub_status.unpublish, pub_status.republish ))
  app.post('/pubDocs/:pubDocId', auth.requiresLogin, pubDocs.update);


/*
  User routes
*/  

  // Auth Routes
  app.get('/logout', users.logout);
  app.post('/signup', users.create);  
  app.post('/reset', users.reset);  
  app.post('/login', users.login);

  // =====================================
  // TWITTER ROUTES ======================
  // =====================================
  // route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // Twitter will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/r' }));

  app.post('/usernametest', auth.requiresLogin, users.testUsername);


  // Update  and Show user routes
  app.param('userId', users.load); // id param
  // update user
  app.post('/users/:userId', auth.user.hasAuthorization, users.update); 
  // show user
  app.get('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.showFull);



/*
  Angular Routes and Cookie
*/
app.get('/partials/*', index.partials);
app.get('/*', index.index);





};