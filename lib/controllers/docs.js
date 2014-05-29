'use strict';

//UserDoc Controller

var mongoose = require('mongoose'),
    Doc = mongoose.model('Doc'),
    async = require('async'),
    users = require('../controllers/users');

//Load 
exports.load = function (req, res, next, id) {
  Doc.load(id, function (err, doc) {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return next(new Error('not found'));
    }
    req.doc = doc;
    next();
  });
};

//Show 
exports.show = function (req, res) {
  res.json(200, req.doc);
};

//Create 
exports.create = function (req, res) {
  var doc = new Doc(req.body);
  doc._owner = req.user._id;
  users.addDoc(req.user._id, doc._id);
  doc.save(function (err) {
    if (err) {
      return res.send(500, err);
    }
    return res.json(201, doc);
  });
};

exports.remove = function (req, res) {
  var doc = req.doc;
  doc.remove(function(err, doc) {
    console.log(err)
  });
};
//List
exports.list = function (req, res) {
  var q =  Doc.find({'_owner': req.user._id});

  q
    .sort('-updated_at')
    .exec(function (err, docs) {
      if (err) {
        return res.send(400, err);
      }
      return res.send(200, docs)
    });

};

//Update
exports.update = function (req, res) {
  var doc = req.doc;
  doc.body = req.body.body;
  doc.updated_at = Date.now();

  doc.save(function (err) {
    if (err) {
      return res.send(500, err);
    }
    return res.send(200, 'Saved');
  });
};