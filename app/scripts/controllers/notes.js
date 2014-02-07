'use strict';

angular.module('wrdz')
.controller('NotesCtrl', function ($scope, Auth, Notes, $timeout, $rootScope) {


  // broadcast from Notes service
  $scope.$on('noteChange', function(event, notes) {
    console.log(notes);
    $scope.notes = notes;
    //$scope.currentNote = notes[0];
    $timeout(function() {
      $scope.currentIndex = 0;
    }, 5);
  });



  // broadcast from Notes service
  $scope.$on('notePush', function(event, note) {
    $scope.notes.push(note);

    //$scope.currentNote = note;
    $timeout(function() {
      $scope.currentNote = note;
    }, 5);
  });


  // broadcast from Auth service
  $scope.$on('logIn', function() {
    Notes.createBulk($scope);
  });
  $scope.$on('register', function() {
    Notes.createBulk($scope, true);
  });


    //function called from node directive
    //takes no arguments...might want to change that
    // and use @findNoteById
  $scope.updateNote = function(){
    var note = $scope.currentNote;
        
    if (note) {
      if (document.getElementById('node0').innerText !== '') {
        // slice number here is max length of title in display
        note.data.title = document.getElementById('node0').innerText.slice(0,22);
      } else {
        note.data.title = moment(note.data.created).format('dddd, M[/]D');
      }
      note.data.updated = moment().format();
      if ($scope.user) {
        Notes.save(note);
      }
    }

  };

  $scope.moment = moment;

  $scope.$on('makeNewNote', function() {
    $scope.newNote();
    // $timeout(function() {
    //   $scope.noteChangeDown();
    // }, 200);
  });

  $scope.newNote = function(event){
    if (event) {
      event.preventDefault();
    }
    var noteTemp = {
      data: {
        nodes : [{
        textValue   : '',
          level        :  1,
          position     :  0
        }],
        created: moment().format(),
        updated: moment().format(),
        title: moment().format('dddd, M[/]D'),
        pinned: false
      }
    };
    if ($scope.user){
      Notes.createNote(noteTemp);
    } else {
      $scope.notes.push(noteTemp);
      $scope.currentNote = noteTemp;
    }
  };

  // TOTALLY NOT DONE JUST FOR NOW 
  // does not delete note from server
  $scope.removeNote = function(note) {
    if (Auth.user.email) {
      var notes = _.reject(Auth.user.notes, function(noteId) {
        return noteId === note._id;
      });
      Auth.user.notes = notes;
      Auth.update(Auth.user);
    }
    $scope.notes.splice($scope.notes.indexOf(note), 1);
  };

  $scope.searchEnter = function () {
    $scope.$broadcast('firstNote');

  };

  $scope.switchNote = function(note) {
    $scope.currentNote = note;
    $timeout(function() {
      $rootScope.$broadcast('noteSwitch', note);
    }, 10);
  };

  $scope.switchIndex = function(index) {
    $scope.currentIndex = index;
  };


  $scope.$on('noteChangeUp', function() {
    $scope.noteChangeUp();
  });

  $scope.$on('noteChangeDown', function() {
    $scope.noteChangeDown();
  });
  

  $scope.noteChangeUp = function() {
    if ($scope.currentIndex !== 0) {
      $scope.currentIndex--;
    }
  };

  $scope.noteChangeDown = function() {
    if ($scope.currentIndex !== $scope.notes.length-1) {
      $scope.currentIndex++;
    }
  };

});
