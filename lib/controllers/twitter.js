'use strict';

var mongoose = require('mongoose'),

User = mongoose.model('User'),
request = require('request'),
twitMedia = require('../config/twitter_update_with_media');




var users = require('../controllers/users');
var pubDocs = require('../controllers/pubDocs');

var twit_consumer_key = 'LfXVuvdovxI3FRx9mDF8jQ';
var twit_consumer_secret = 'yznvsGO31Xo4T6y8Zx0sEYncTK62rJDHDWdqT9rs8';

var bitly_token = "670fb6967c7d7ff1854f62467475b84a58f4f83d";


exports.shortenUrl = function (req, res) {
  var url = encodeURIComponent(req.body.url);

  request('https://api-ssl.bitly.com/v3/shorten?access_token='+bitly_token+'&longUrl='+url+'&format=txt' ,
    function (error, response, body) {
      return res.send(200, body);
    }
  )
}


exports.postPic = function (req, res) {

  User.findOne({ _id: req.body.user._id}, function (err, user) {
    if (err) console.log(err);

    var twit_access_token = user.twitter.secrets.token;
    var twit_access_token_secret = user.twitter.secrets.tokenSecret;

    var string = req.body.pic;
    var regex = /^data:.+\/(.+);base64,(.*)$/;

    var matches = string.match(regex);
    var ext = matches[1];
    var data = matches[2];
    var buffer = new Buffer(data, 'base64');




    var T = new twitMedia({
        consumer_key:         twit_consumer_key
      , consumer_secret:      twit_consumer_secret
      , token:                twit_access_token 
      , token_secret:         twit_access_token_secret
    })


    console.log(req.body.message);

    // Do something with data
    T.post(req.body.message, buffer , function(err, response) {
      if (err) {
        console.log(err);
      }
      return res.send(200, "All good!");
      // console.log(response);
    });


  });

};

exports.noPic = function (req, res) {

};
