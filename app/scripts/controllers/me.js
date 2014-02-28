'use strict';

angular.module('wrdz')
.controller('MeCtrl', function ($scope, User, Profile, $state) {


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

  // $scope.$watch(function  () {
  //   return Profile.getDocs();
  // }, function  (newValue, oldValue) {
  //   if (newValue) {
  //     $scope.currentDocs = newValue;
  //   }
  // });

  // $scope.$watch(function  () {
  //   return Profile.getDocIds();
  // }, function  (newValue, oldValue) {
  //   if (newValue) {
  //     $scope.docIds = newValue;
  //     Profile.getDocServer_20();
  //   }
  // });









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
