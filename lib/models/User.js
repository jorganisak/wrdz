'use strict';

var mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

// Schema
var UserSchema = new Schema({
  username: { type: String, default: '' },
  created: {type: Date, default: Date.now},
  _docs: [{type: Schema.Types.ObjectId, ref: 'Doc'}],

  google: {
    id: {type: String},
    displayName: {type: String},
    email: [ {value: {type: String}} ]
  },

  twitter : {
    profile: {
      id: {type: String},
      username: {type: String},
      displayName: {type: String},
      photos: [ { value: {type: String} }]
    },
    secrets : {
      token: {type:String},
      tokenSecret: {type:String}
    },
  },

  provider: {type:String},

});


mongoose.model('User', UserSchema);