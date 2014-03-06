'use strict';

var mongoose = require('mongoose'),
  crypto = require('crypto');
var Schema = mongoose.Schema;
    
// Schema
var UserSchema = new Schema({

  username: { type: String, default: '' },

  karma : Number,

  email: { type: String, default: '' },

  _pubDocs: [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],


  // exclude below from Profile View

  current_doc: {type: Schema.Types.ObjectId, ref: 'UserDoc'},


  meta : {
    _up_votes : [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],
    _hearts : [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],
    _views : [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],
  },

  topics : [{
    topicId: {type: Schema.Types.ObjectId, ref: 'Tag'}, 
    count : {type: Number, default: 0}
  }],

  _userDocs: [{type: Schema.Types.ObjectId, ref: 'UserDoc'}],

  messages: [ {
    id : {type: Schema.Types.ObjectId, ref: 'Message'},
    is_archived: {type: Boolean, default: false},
    is_author : {type: Boolean, default: false},
    has_star: {type: Boolean, default: false}
  }],

  

  // Probs don't send these to the server ever
  hashed_password: { type: String, default: '' },
  provider: {type:String, default: ''},
  salt: { type: String, default: '' },




});

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password ;});

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('email').validate(function (email) {
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');

UserSchema.path('username').validate(function (username, fn) {
  var User = mongoose.model('User');

  // Check only when it is a new user or when username field is modified
  if (this.isNew || this.isModified('username')) {
    User.find({ username: username }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Username already exists');

UserSchema.path('username').validate(function (username) {
  return username.length
}, 'Username cannot be blank')

UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password)
    )
    next(new Error('Invalid password'));
  else
    next();
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred;
    } catch (err) {
      return '';
    }
  },


  incTopic : function (topicId) {
    var flag = true;
    for (var i = 0 ; i < this.topics.length ; i++ ) {
      var str1 = String(this.topics[i].topicId);
      var str2 = String(topicId);
      if (str1 === str2) {
        console.log('found match');
        this.topics[i].count++;
        flag = false;
      }
    }

    if (flag) {
      console.log('pushing topic!');
      this.topics.push({'topicId':topicId, 'count':1})
    }

    this.save(function (err) {
    })


  }

};


mongoose.model('User', UserSchema);