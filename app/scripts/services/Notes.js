'use strict';

angular.module('wrdz')
.factory('Notes', function ($http, Auth, $rootScope) {
    // Service logic
    // ...

  
    function changeNotes(newNotes, scope) {
      if (scope) {
        scope.notes = newNotes;
        scope.currentIndex = 0;
      } else {
        $rootScope.$broadcast('noteChange', newNotes);
      }
    }

    function addToUser(note) {
      var userNotes = Auth.user.notes;
      if (userNotes) {
        userNotes.push(note._id);
      } else {
        userNotes = [note._id];
      }
    }

    function pushNote(note) {
      $rootScope.$broadcast('notePush', note);
    }


    function createNote(note) {
      note.data.owners = [Auth.user._id];
      $http.post('/notes', note).success(function(res) {
        pushNote(res);
        addToUser(res);
      }).error();
    }

    function getAllNotes() {
        return $http.get('/notes').success(function(res) {
          return res;
        }).error(function(err){
          console.log(err);
        });
      }

    var extraNote = {
          data: {
            nodes : [
            {
              textValue   : 'Thanks for signing up!',
              level        :  1,
              position     :  0
            },
            {
              textValue   : 'A few tips :',
              level        :  2,
              position     :  1
            },
            {
              textValue   : '',
              level        :  2,
              position     :  2
            },
            {
              textValue   : 'To quickly create a new note, hit :',
              level        :  2,
              position     :  3
            },
            {
              textValue   : 'Ctrl + K',
              level        :  3,
              position     :  4
            },
            {
              textValue   : 'To move through your notes you can use:',
              level        :  2,
              position     :  5
            },
            {
              textValue   : 'Ctrl + Up',
              level        :  3,
              position     :  6
            },
            {
              textValue   : '&',
              level        :  4,
              position     :  7
            },
            {
              textValue   : 'Ctrl + Down',
              level       : 3,
              position     :  8
            },
            {
              textValue   : 'Try making a new note with Ctrl + K, then coming back to this note with Ctrl + Up',
              level        :  4,
              position     :  9
            },
            {
              textValue   : 'Also, check out the blue pin next to this note on the left. The pin keeps your important notes at the top.',
              level        :  4,
              position     :  10
            },
            {
              textValue   : '',
              level        :  4,
              position     :  11
            },
            {
              textValue   : 'Last and most importantly ...',
              level        :  1,
              position     :  12
            },
            {
              textValue   : 'Please use the feedback button on the right to let me know anything at all about your experience with wrdz.   Thanks!',
              level        :  2,
              position     :  13
            },
            ],
            created: moment().format(),
            updated: moment().format(),
            title: 'Some tips',
            pinned: true
          }
        };

    // Public API here
    return {

      // newNotes must be an array, scope is optional
      changeNotes : changeNotes,

      initNoUser : function(scope) {
        var noteTemp = {
          data: {
            nodes : [
            {
              textValue   : 'Welcome!',
              level        :  1,
              position     :  0
            },
            {
              textValue   : '',
              level        :  1,
              position     :  1
            },
            {
              textValue   : 'Wrdz is a place to write things down. You can edit this text right here. Try it!',
              level        :  1,
              position     :  2
            },
            {
              textValue   : '',
              level        :  1,
              position     :  3
            },
            {
              textValue   : "There are four indentation levels on wrdz. You can switch between them using the arrows on the right, or by pressing 'tab' and 'shift-tab' on your keyboard.",
              level        :  2,
              position     :  4
            },
            {
              textValue   : '',
              level        :  3,
              position     :  5
            },
            {
              textValue   : 'This one is a little smaller. Fancy, right?',
              level        :  3,
              position     :  6
            },
            {
              textValue   : 'Here is some small text for meaningful thoughts.',
              level        :  4,
              position     :  7
            },
            {
              textValue   : "",
              level        :  2,
              position     :  8
            },
            {
              textValue   : "Get started with your own notes by signing up with the form on the right. Don't worry, this note will come with you   :)",
              level        :  2,
              position     :  9
            }
            ],
            created: moment().format(),
            updated: moment().format(),
            title: 'Welcome!',
            pinned: false
          }
        };

        changeNotes([noteTemp], scope);
        
      },

      //get rid of this scope passing...
      createBulk : function(scope, b) {
        if (b) {
          
          createNote(extraNote, scope);

          _.each(scope.notes, function(note) {
            createNote(note, scope);
          });
        }
        getAllNotes().then(function(res) {
          console.log(res.data);
          changeNotes(res.data);


        });
      },

      getAllNotes : getAllNotes,

      save : function(note) {
        $http.post('/savenotes', note).success(function(res) {
          // console.log(res);
        }).error(function  (err) {
          console.log(err);
        });
      },

      //user is logged in, creating a note
      createNote : createNote
    };
  });
