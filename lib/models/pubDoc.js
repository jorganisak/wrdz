'use strict';

/*
  
  Public Doc Model

*/

/*
  Declare dependencies
*/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
  Schema
*/

var PubDocSchema = new Schema({

  // ONLY POPULATE: ( title body has_title topics -_id)
  doc : {type: Schema.Types.ObjectId, ref: 'UserDoc'},

  published_at: {type: Date, default: Date.now},

  is_visible : {type: Boolean, default: true},

  up_votes: {type: Number, default: 1},

  topics: [{type: Schema.Types.ObjectId, ref:'Topic'}],


  hearts: {type: Number, default: 0},

  reposts: {type: Number, default: 0},

  is_anon : {type: Boolean, default: false},

  author: {type: Schema.Types.ObjectId, ref: 'User'},


  // Don't send to server

  views: {type: Number, default: 0},

  score: {type: Number, default: 1},

  meta: {
    _up_votes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    _hearts: [{type: Schema.Types.ObjectId, ref: 'User'}],
    _views: [{type: Schema.Types.ObjectId, ref: 'User'}],
    _reposts: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },

  _owner : {type: Schema.Types.ObjectId, ref: 'User'}

});





PubDocSchema.statics = {
  load : function (id, cb) {
    this.findOne({_id: id})
      .populate('doc', 'title body has_title')
      .populate('author','username bio followers karma')
      .populate('topics')
      .exec(cb);
  }
};

mongoose.model('PubDoc', PubDocSchema);