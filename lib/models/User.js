'use strict';

var mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

// Schema
var UserSchema = new Schema({
  username: { type: String, default: '' },
  email: { type: String, default: '' },
  created: {type: Date, default: Date.now},
  _docs: [{type: Schema.Types.ObjectId, ref: 'Doc'}],
  //twitter - grow this to include all of the stuff sent by twitter
  twitter : {
    id: {type:Number},
    token: {type:Number},
    username: {type:String},
    displayName: {type:String},
    secrets : {
      token: {type:String, default: ""},
      tokenSecret: {type:String, default: ""}
    },
  },

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
  if (this.provider !== 'local') return true;

  return email.length;
}, 'Email cannot be blank');


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
  if (this.provider !== 'local') return true;
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (this.provider !== 'local') return next();

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