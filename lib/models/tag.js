'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Only users who are auth'ed and own notes can look at them from this DB
// All public note views must come from PubDoc model

// Schema
var TagSchema = new Schema({
  title: {type : String, default : '', trim : true},
  _docs: [{type: Schema.Types.ObjectId, ref: 'UserDoc'}],

  _owner: {type: Schema.Types.ObjectId, ref: 'User'}

  
});


TagSchema.methods = {



};

TagSchema.statics = {

  // find user note by ID
  load : function(id, cb) {
    this.findOne({_id: id})
      .exec(cb);
  },


};

mongoose.model('Tag', TagSchema);