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

  hearts: {type: Number, default: 0},

  is_anon : {type: Boolean, default: false},

  author: {type: Schema.Types.ObjectId, ref: 'User'},


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
/*
  TODO : INCLUDE KARMA OF PUBLISHING USER IN SCORE

  TODO: CALCULATE KARMA OF USER

  THESE MIGHT NEED TO GO IN SEPERATE UTIL FILES?

*/
  // to be called on update of any meta data
  calculateScore : function () {
    var timeElapse = Date.now() - this.published_at;
    // console.log(timeElapse * 0.00001);
    var val = Math.round(
      (this.up_votes +
        this.hearts * 1.1 +
        this.views * 0.2 -
        timeElapse * 0.000000001) * 100
    );

    // console.log(val);

    this.score = val;
  }
};

PubDocSchema.statics = {
  load : function (id, cb) {
    this.findOne({_id: id}, 'published_at author score up_votes hearts doc')
      .populate('doc', 'title body has_title topics')
      .populate('author','username')
      .exec(cb);
  }
};

mongoose.model('PubDoc', PubDocSchema);