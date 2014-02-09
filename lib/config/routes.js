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

  // Server Routes

  // feedback
  app.post('/feedback', auth.requiresLogin, feedback.create);

  //userDoc routes
  app.param('userDocId', userDocs.load);
  app.post('/userDocs', auth.requiresLogin, userDocs.create);
  app.get('/userDocs/:userDocId', auth.requiresLogin, auth.userDoc.hasAuthorization, userDocs.show);
  // app.post('/userDocs/:userDocId', auth.requiresLogin, userDocs.update);

  //pubDoc routes
  app.param('pubDocId', pubDocs.load);
  app.post('/pubDocs', auth.requiresLogin, pubDocs.create);
  app.get('/pubDocs/:pubDocId', pubDocs.show);
  app.get('/pubDocs', pubDocs.list);

  // user routes
  app.get('/logout', users.logout);
  app.post('/signup', users.create);
  app.post('/login', users.login);


  app.post('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.update);
  app.get('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.show);

  app.param('userId', users.user);

// Angular Routes
app.get('/partials/*', index.partials);
app.get('/*', index.index);





};