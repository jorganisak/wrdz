'use strict';

// This seems to be on the edge of needing a directive.
// Will make it one for now, but leave open the option of keeping it in the controller.
// Think strongly before creating an isolated scope.

angular.module('wrdz')
  .directive('noteInList', function ($timeout, Auth) {
    return {
      templateUrl: 'partials/noteInList',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {


        scope.archive = function() {
          scope.noArchive = false;
          if (scope.status) {
            scope.noteChangeDown();
          }
          scope.archived = true;
          $timeout(function() {
            if (!scope.noArchive) {
              scope.removeNote(scope.note);
            }
          }, 5000);
        };

        scope.$on('firstNote', function() {
          if (scope.$first) {
                console.log('searching');

            scope.switchNote(scope.note);

            
          }
        });

        scope.$watch('currentNote', function(newValue, oldValue) {
          if (newValue) {
            if (newValue === scope.note) {
              scope.status = 'current-note-in-list';

            } else {
              scope.status = '';
            }
          }
        });

        scope.$watch('currentIndex', function(newValue, oldValue) {
          if (String(newValue) === String(scope.$index) && !scope.searchText) {
            if (scope.currentNote !== scope.note) {
              scope.switchNote(scope.note);
            }
          }

        });

        scope.$watch('$index', function(newValue,oldValue) {
          if (scope.currentNote === scope.note && !scope.searchText) {
            scope.switchIndex(newValue);
          }
        });

        scope.switchButtons = function () {
          scope.buttons = !scope.buttons;
        };

        scope.pinClick = function () {
          scope.note.data.pinned = !scope.note.data.pinned;
          console.log('click pin');
        };


      }
    };
  });
