'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema
var MessageSchema = new Schema({

  messages : [
    {
      content: String,
      sent_at : {type: Date, default: Date.now},

    }

  ],
  on_note : {type: Schema.Types.ObjectId, ref: 'PubDoc'},
  created: {type: Date, default: Date.now},


  meta : {

    participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    
  }
  
});

MessageSchema.methods = {
    
};

mongoose.model('Message', MessageSchema);