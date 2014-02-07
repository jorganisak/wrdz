'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema
var PubDocSchema = new Schema({
  data : {
    body : String,
    title: String,
    published_at: {type: Date, default: Date.now},
    score: Number,
    up_votes: Number,
    hearts: Number,
    views: Number,
    tweets: Number
  },
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  meta: {
    up_votes_users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    hearts_users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    views_users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    tweets_users: [{type: Schema.Types.ObjectId, ref: 'User'}]
  }
  
});

PubDocSchema.methods = {

  calculateScore : function() {

  }

    
};

PubDocSchema.statics = {

  // find user note by ID
  load : function(id, cb) {
    this.findOne({_id: id}, 'data')
      .exec(cb);
  }

};

mongoose.model('PubDoc', PubDocSchema);