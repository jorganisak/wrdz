'use-strict';

/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 Feedback = mongoose.model('Feedback');


/**
 * Create Feedback
 */

 exports.create = function (req, res) {
  var data = {};
  if (req.user) {
    data.user = req.user;
  };
  data.content = req.body.content;
  var feedback = new Feedback(data);
  feedback.save(function (err, feedback) {
    if (err) {
      return res.send(err);
    }
    return res.send('Success');
  });
};