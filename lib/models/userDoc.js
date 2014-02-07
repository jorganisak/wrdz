'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Only users who are auth'ed and own notes can look at them from this DB
// All public note views must come from PubDoc model

// Schema
var UserDocSchema = new Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
  created: {type: Date, default: Date.now},
  is_published: Boolean,
  pub_info : {
    up_votes: Number,
    hearts: Number,
    views: Number,
    tweets: Number
  },

  _owner: {type: Schema.Types.ObjectId, ref: 'User'}

  
});

UserDocSchema.path('title').required(true, 'Doc title cannot be blank');
UserDocSchema.path('body').required(true, 'Doc body cannot be blank');

UserDocSchema.methods = {

  publish: function () {

  },

  unpublish: function () {

  },

  copyToWrite : function () {

  },

  updatePubInfo : function () {

  },

  archive : function () {

  }


};

UserDocSchema.statics = {

  // find user note by ID
  load : function(id, cb) {
    this.findOne({_id: id})
      .exec(cb);
  }

};

mongoose.model('UserDoc', UserDocSchema);