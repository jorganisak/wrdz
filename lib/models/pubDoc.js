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

  body : String,

  title: String,

  published_at: {type: Date, default: Date.now},

  

  has_title: {type: Boolean, default: false},

  up_votes: {type: Number, default: 1},

  hearts: {type: Number, default: 0},

  topics: [{type: Schema.Types.ObjectId, ref: 'Topic'}],

  is_anon : {type: Boolean, default: false},

  author: {type: String, default: ''},


  // Don't send to server

  views: {type: Number, default: 0},

  score: {type: Number, default: 1},

  meta: {
    _up_votes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    _hearts: [{type: Schema.Types.ObjectId, ref: 'User'}],
    _views: [{type: Schema.Types.ObjectId, ref: 'User'}],
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
  calculateScore : function () {
    var timeElapse = Date.now() - this.published_at;
    console.log(timeElapse * 0.00001);
    var val = Math.round(
      (this.up_votes +
        this.hearts * 1.1 +
        this.views * 0.2 -
        timeElapse * 0.000000001) * 100
    );

    console.log(val);

    this.score = val;
  }
};

PubDocSchema.statics = {
  load : function (id, cb) {
    this.findOne({_id: id}, 'body published_at title views author score up_votes hearts')
      .exec(cb);
  }
};

mongoose.model('PubDoc', PubDocSchema);