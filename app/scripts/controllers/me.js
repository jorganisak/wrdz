'use strict';

angular.module('me')
.controller('MeCtrl', function ($scope, User, $state) {

/*
MY WRDZ 
*/

  // TEMPORARY
  if ($scope.user) {
    $scope.doc = $scope.user.current_doc;
  }

  $scope.currentDocs = [];

  $scope.docIds = [];

  $scope.$on('userChange', function  (evt, user) {
    if (user) {
    $scope.doc = $scope.user.current_doc;
    } else {
      // Profile.setDocIds([]);
      // Profile.setDocs([]);
    }

  });


/*

LOGOUT

*/
  $scope.logout = function() {
    if ( User.isLoggedIn() ) {
      User.logout().
      success( function( data ) {
        User.changeUser(null);
        if (data == 'Logged out now.') {
          $state.go('landing');
        }
      }).error(function(err) {
        console.log(err);
      });
    }
  };
});
