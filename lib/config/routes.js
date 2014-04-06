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
  picture = require('../controllers/picture'),
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


var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || "AKIAJLPXR355FQFPIJDQ";
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || "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";
var S3_BUCKET = process.env.S3_BUCKET || "wrdz-images"
/*
  Picture routes
*/
app.get('/sign_s3', function(req, res){
    var object_name = req.query.s3_object_name;
    var mime_type = req.query.s3_object_type;

    var now = new Date();
    var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:public-read";

    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;

    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
    signature = encodeURIComponent(signature.trim());
    signature = signature.replace('%2B','+');

    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

    var credentials = {
        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
        url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();
});

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

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/w',
      failureRedirect : '/'
    }));

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