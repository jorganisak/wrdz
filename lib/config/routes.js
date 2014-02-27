/**
 * Module dependencies.
 */

 var async = require('async');

/**
 * Controllers
 */

 var users = require('../controllers/users'),
  userDocs = require('../controllers/userDocs'),
  pubDocs = require('../controllers/pubDocs'),
  feedback = require('../controllers/feedbacks'),
  auth = require('./middlewares/authorization'),
  index = require('../controllers');

/**
 * Expose routes
 */

 module.exports = function (app, passport) {



  // feedback
  app.post('/feedback', auth.requiresLogin, feedback.create);



/*
  User Docs Routes
*/
  app.param('userDocId', userDocs.load);
  app.get('/userDocs', auth.requiresLogin, userDocs.create);
  app.get('/userDocs/:userDocId', auth.requiresLogin, auth.userDoc.hasAuthorization, userDocs.show);
  app.post('/userDocs/:userDocId', auth.requiresLogin, auth.userDoc.hasAuthorization, userDocs.update);

/*
  Public Doc routes
*/

  app.param('pubDocId', pubDocs.load); // id param
  app.post('/pubDocs', auth.requiresLogin, pubDocs.create);
  app.get('/pubDocs/:pubDocId', pubDocs.show);
  app.post('/pubDocs/:pubDocId', pubDocs.update);
  app.get('/pubDocs', pubDocs.list);

/*
  User routes
*/  

  // Auth Routes
  app.get('/logout', users.logout);
  app.post('/signup', users.create);  
  app.post('/login', users.login);

  // Update  and Show user routes
  app.param('userId', users.user); // id param
  app.post('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.update);
  app.get('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.show);


/*
  Angular Routes and Cookie
*/
app.get('/partials/*', index.partials);
app.get('/*', index.index);





};