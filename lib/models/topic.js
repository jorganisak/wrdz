'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Only users who are auth'ed and own notes can look at them from this DB
// All public note views must come from PubDoc model

// Schema
var TopicSchema = new Schema({

  title: {type : String, default : '', trim : true},

  _userDocs: [{type: Schema.Types.ObjectId, ref: 'UserDoc'}],

  _pubDocs: [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],

  _owner: {type: Schema.Types.ObjectId, ref: 'User'}

});


TopicSchema.methods = {



};

TopicSchema.statics = {

  // find topic note by ID
  load : function(id, cb) {
    this.findOne({_id: id})
      .exec(cb);
  },


};

mongoose.model('Topic', TopicSchema);