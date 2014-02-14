'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema
var PubDocSchema = new Schema({
  
  body : String,
  title: String,
  published_at: {type: Date, default: Date.now},
  score: {type: Number, default: 1},
  up_votes: {type: Number, default: 1},
  hearts: {type: Number, default: 0},
  views: {type: Number, default: 0},
  tweets: {type: Number, default: 0},
  is_anon : {type: Boolean, default: false},
  author: {type: String, default: ''},
  
  meta: {
    _owner: {type: Schema.Types.ObjectId, ref: 'User'},
    _up_votes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    _hearts: [{type: Schema.Types.ObjectId, ref: 'User'}],
    _views: [{type: Schema.Types.ObjectId, ref: 'User'}],
    _tweets: [{type: Schema.Types.ObjectId, ref: 'User'}]
  }
  
});


// Calculating score is probably a virtual here... 
// 

// PubDocSchema.virtual('score').get(function  () {
//   // do a badass geometric average here..still need some date variable
//   return this.up_votes + this.hearts * 1.1 + this.views*0.5;
// });

PubDocSchema.methods = {

  // to be called on update of any meta data
  calculateScore : function() {
    this.score = this.up_votes + this.hearts * 1.1 + this.views*0.5;
  }

    
};

PubDocSchema.statics = {


  load : function(id, cb) {
    this.findOne({_id: id}, 'body title score up_votes hearts')
      .exec(cb);
  }
};

mongoose.model('PubDoc', PubDocSchema);