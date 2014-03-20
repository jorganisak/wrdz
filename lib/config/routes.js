'use strict';

/**
 * Module dependencies.
 */
 var async = require('async');

//Controllers
 var users = require('../controllers/users'),
  userDocs = require('../controllers/userDocs'),
  pubDocs = require('../controllers/pubDocs'),
  topics = require('../controllers/topics'),
  feedback = require('../controllers/feedbacks'),
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
  app.post('/login', users.login);
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', 
      { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
  });


  // Update  and Show user routes
  app.param('userId', users.user); // id param
  // update user
  app.post('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.update); 
  // show user
  app.get('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.showFull);
  //show profile
  // app.get('/p/:userId', users.showProfile);  


/*
  Angular Routes and Cookie
*/
app.get('/partials/*', index.partials);
app.get('/*', index.index);





};