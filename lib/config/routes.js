'use strict';

var async = require('async');
var crypto = require('crypto');

//Controllers
var users = require('../controllers/users'),
  docs = require('../controllers/docs'),
  feedback = require('../controllers/feedbacks'),
  auth = require('./middlewares/authorization'),
  passport = require('passport'),
  index = require('../controllers');

//ROUTES

module.exports = function (app, passport) {
  // feedback
  app.post('/feedback', feedback.create);
  //Docs Routes
  app.param('docId', docs.load);
  app.post('/docs', auth.requiresLogin, docs.create);
  app.get('/docs', auth.requiresLogin, docs.list);
  app.get('/docs/:docId', auth.requiresLogin, auth.doc.hasAuthorization, docs.show);
  app.put('/docs/:docId', auth.requiresLogin, auth.doc.hasAuthorization, docs.update);
  app.del('/docs/:docId', auth.requiresLogin, auth.doc.hasAuthorization, docs.remove);
  //User routes
  app.get('/logout', users.logout);
  app.post('/signup', users.create);  
  app.post('/reset', users.reset);  
  app.post('/login', users.login);
  app.post('/usernametest', auth.requiresLogin, users.testUsername);
  // Update  and Show user routes
  app.param('userId', users.load); // id param
  app.post('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.update); 
  app.get('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.showFull);
  // Twitter
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', 
      passport.authenticate('twitter', { successRedirect: '/',
          failureRedirect: '/r' }));
  //Google
  app.get('/auth/google', passport.authenticate('google'));
  app.get('/auth/google/return', 
      passport.authenticate('google', { successRedirect: '/',
        failureRedirect: '/'}));
  //Angular Routes and Cookie
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};