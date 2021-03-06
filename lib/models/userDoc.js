'use strict';
/*
UserDoc Model
*/


/*
  Load dependencies
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/*
  Schema
*/


var UserDocSchema = new Schema({

  body: {type : String, default : '', trim : true},

  created_at: {type: Date, default: Date.now},

  updated_at: {type: Date, default: Date.now},

  is_published: {type: Boolean, default: false },

  is_archived: {type: Boolean, default: false},

  pub_doc : {type: Schema.Types.ObjectId, ref: 'PubDoc'},

  _owner: {type: Schema.Types.ObjectId, ref: 'User'}
  
});




UserDocSchema.methods = {


};



UserDocSchema.statics = { 
  // find user note by ID
  load : function(id, cb) {
    this.findOne({_id: id})
      .exec(cb);
  },
};

mongoose.model('UserDoc', UserDocSchema);