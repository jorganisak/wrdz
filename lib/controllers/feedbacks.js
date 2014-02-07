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
  var feedback = new Feedback(req.body);
  console.log(req.body);
  feedback.save(function (err) {
    if (err) {
      return res.send(err);
    }
    
    return res.send('Success');
  });
};