'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Only users who are auth'ed and own notes can look at them from this DB
// All public note views must come from PubDoc model

// Schema
var TopicSchema = new Schema({

  title: {type : String, default : '', trim : true},

  // okay to send to client? never populate...
  _docs: [{type: Schema.Types.ObjectId, ref: 'UserDoc'}],
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