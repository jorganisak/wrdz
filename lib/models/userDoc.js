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
  is_published: {type: Boolean, default: false },
  pub_info : {
    up_votes: Number,
    hearts: Number,
    views: Number,
    tweets: Number
  },

  _owner: {type: Schema.Types.ObjectId, ref: 'User'}

  
});


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
  },


};

mongoose.model('UserDoc', UserDocSchema);