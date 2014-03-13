'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
// Schema
var FeedbackSchema = new Schema({
  content: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'},

  created: {type: Date, default: Date.now}
});

mongoose.model('Feedback', FeedbackSchema);