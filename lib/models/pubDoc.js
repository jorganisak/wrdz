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
  doc : {type: Schema.Types.ObjectId, ref: 'UserDoc'},
  published_at: {type: Date, default: Date.now},
  is_visible : {type: Boolean, default: true},
  up_votes: {type: Number, default: 1},
  is_anon : {type: Boolean, default: false},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  // Don't send to server
  score: {type: Number, default: 1},
  meta: {
    _up_votes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  _owner : {type: Schema.Types.ObjectId, ref: 'User'}
});



// TODO : lots of places population goes on, loading occuring in model and controller
PubDocSchema.statics = {
  load : function (id, cb) {
    this.findOne({_id: id})
      .populate('doc', 'body')
      .populate('author','username karma')
      .populate('topics')
      .exec(cb);
  }
};

mongoose.model('PubDoc', PubDocSchema);