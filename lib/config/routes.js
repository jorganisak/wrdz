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
    // User Docs Routes
    app.param('docId', docs.load);
    app.post('/docs', auth.requiresLogin, docs.create);
    app.get('/docs', auth.requiresLogin, docs.list);
    app.get('/docs/:docId', auth.requiresLogin, auth.doc.hasAuthorization, docs.show);
    app.post('/docs/:docId', auth.requiresLogin, auth.doc.hasAuthorization, docs.update);
    //User routes
    app.get('/logout', users.logout);
    app.post('/signup', users.create);  
    app.post('/reset', users.reset);  
    app.post('/login', users.login);
    // Twitter
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', 
        passport.authenticate('twitter', { successRedirect: '/',
            failureRedirect: '/r' }));
    app.post('/usernametest', auth.requiresLogin, users.testUsername);
    // Update  and Show user routes
    app.param('userId', users.load); // id param
    // update user
    app.post('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.update); 
    // show user
    app.get('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.showFull);
    app.get('/users/simple/:userId', users.showSmall);
    //Angular Routes and Cookie
    app.get('/partials/*', index.partials);
    app.get('/*', index.index);
};