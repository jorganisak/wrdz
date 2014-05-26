'use strict';
//Doc Model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//Schema

var DocSchema = new Schema({

  body: {type : String, default : '', trim : true},

  created_at: {type: Date, default: Date.now},

  updated_at: {type: Date, default: Date.now},

  is_archived: {type: Boolean, default: false},

  _owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

DocSchema.methods = {

};

DocSchema.statics = { 
  // find user note by ID
  load : function(id, cb) {
    this.findOne({_id: id})
      .exec(cb);
  },
};

mongoose.model('Doc', DocSchema);