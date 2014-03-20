'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



// Schema
var TopicSchema = new Schema({

  title: {type : String, default : '', trim : true},

  score: {type: Number, default: 0 },

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