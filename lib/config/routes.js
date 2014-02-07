/**
 * Module dependencies.
 */

 var async = require('async');

/**
 * Controllers
 */

 var users = require('../controllers/users'),
  userDocs = require('../controllers/userDocs'),
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

  //note routes
  app.param('useDocId', userDocs.load);
  app.post('/userDocs', auth.requiresLogin, userDocs.create);
  // app.get('/userDocs/:userDocId', auth.requiresLogin, userDocs.show);
  // app.put('/userDocs/:userDocId', auth.requiresLogin, userDocs.update);
  // app.del('/userDocs/:userDocId', auth.requiresLogin, userDocs.destroy);



  // user routes
  app.get('/logout', users.logout);
  app.post('/signup', users.create);
  app.post('/login', users.login);
  app.post('/updateuser', users.update);

  app.get('/users/:userId', users.show);

  app.param('userId', users.user);

// Angular Routes
app.get('/partials/*', index.partials);
app.get('/*', index.index);





};