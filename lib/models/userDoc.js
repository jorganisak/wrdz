'use strict';
/*

UserDoc Model

  @load (static)

*/

/*
  Load dependencies
*/

var mongoose = require('mongoose'),
    
    Schema = mongoose.Schema;



// Only users who are auth'ed and own notes can look at them from this DB
// All public note views must come from PubDoc model


/*

  Schema

*/

var UserDocSchema = new Schema({

  title: {type : String, default : '', trim : true},

  body: {type : String, default : '', trim : true},

  sample: {type: String},

  has_title: {type: Boolean, default:false},

  topics: [{type: Schema.Types.ObjectId, ref:'Topic'}],

  created_at: {type: Date, default: Date.now},

  updated_at: {type: Date, default: Date.now},

  is_published: {type: Boolean, default: false },

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