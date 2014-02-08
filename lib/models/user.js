'use strict';

var mongoose = require('mongoose'),
  crypto = require('crypto');
var Schema = mongoose.Schema;
    
// Schema
var UserSchema = new Schema({

  email: { type: String, default: '' },
  username: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },

  can_publish: {type: Boolean, default: true },

  last_publish: {type: String},
  
  current_doc: {
    body: String,
    title: String
  },

  karma : Number,

  _stars : [{type: Schema.Types.ObjectId, ref: 'UserDoc'}],

  meta : {
    _up_votes : [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],
    _hearts : [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],
    _views : [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],
  },

  _userDocs: [{type: Schema.Types.ObjectId, ref: 'UserDoc'}],
  _pubDocs: [{type: Schema.Types.ObjectId, ref: 'PubDoc'}],

  messages: [ {
    id : {type: Schema.Types.ObjectId, ref: 'Message'},
    is_archived: {type: Boolean, default: false},
    has_star: {type: Boolean, default: false}
  }],

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

// the below 5 validations only apply if you are signing up traditionallt

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

// UserSchema.path('username').validate(function (username) {
//   return username.length
// }, 'Username cannot be blank')

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

};


mongoose.model('User', UserSchema);