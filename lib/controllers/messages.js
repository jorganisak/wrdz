'use-strict';

/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 Note = mongoose.model('Note'),
 User = mongoose.model('User'),
 Message = mongoose.model('Message'),
 async = require('async');

/**
 * Create note
 */

exports.create = function (req, res) {
  var note = new Note(req.body);
  console.log(req.body);
  note.save(function (err) {
    if (err) {
      return res.send(err);
    }
    User.update({_id: req.body.data.owners[0]},
      {$push: {notes: note._id}},
      {safe: true, upsert: true},
      function(err) {
        if (err) console.log(err);
      });

    return res.json(note);
  });
};

/**
 * Update a note
 */

exports.update = function(req, res) {
  var id = req.body._id;
  var newNote = req.body.data;

  Note.findById(id, function(err, note) {
    if (err) console.log(err);

    note.data = newNote;

    note.save(function(err) {
      if (err) console.log(err);

      res.send("Saved")

    });
  });


};

/**
 * Get all notes from a user
 */

 exports.findAll = function (req, res) {
  var userId = req.user._id.toString();
  var noteIds = req.user.notes;
  var notes = [];

  function findAllNotes(id, cb) {
    Note.findById(id, function(err, note) {
      if (err) return res.send(err);

      for (var i =0; i < note.data.owners.length; i++) {
        if (note.data.owners[i] == userId) {
          notes.push(note);
        } else {
          console.log('Not Authorized!!');
        }
      }
      cb();
    });
  }

  async.each(noteIds, findAllNotes, function(err) {
    return res.json(notes);
  });
};