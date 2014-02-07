'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
// Schema
var FeedbackSchema = new Schema({
  content: String,
  userEmail: String,
  created: Date
});

mongoose.model('Feedback', FeedbackSchema);