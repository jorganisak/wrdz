'use strict';

angular.module('wrdz')
  .controller('NavbarCtrl', function ($scope, $state, User) {


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
