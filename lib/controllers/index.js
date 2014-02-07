'use strict';

var path = require('path');

exports.partials = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if(err) {
      res.render('404');
    } else {
      res.send(html);
    }
  });
};

exports.index = function(req, res) {
  var email = '';
  var _id = '';
  var notes = [];
  if(req.user) {
    email = req.user.email;
    _id   = req.user.id;
    notes = req.user.notes;
  }
  res.cookie('user', JSON.stringify({
    
     'email': email,
     '_id'  : _id,
     'notes': notes
  }));


  res.render('index');



};
