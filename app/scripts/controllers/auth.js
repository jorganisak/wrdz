'use strict';

/*
  Auth Controller
    - For Sign In and Sign Up Modals
*/

angular.module('shared')

  .controller('AuthCtrl', function ($scope, User, $state) {

    $scope.signup = function (user) {
      if (!User.isLoggedIn()) {
        User.signup(user).
          success(function(user, status, headers, config)
          {
            User.changeUser(user);
            $state.go('read');
          }).
          error(function(err, status, headers, config)
          {
            console.log(err.errors.email.type);
            $scope.message = 'Something went wrong...someone probably already has that email on here.';
          });
        }
      };

      $scope.signin = function(user) {
        if (!User.isLoggedIn()){
          User.signin(user).
          success(function(user, status, headers, config) {
            User.changeUser(user);
            $state.go('read');
          }).
          error(function(err, status, headers, config) {
            if (err == 'Unknown user') {
              $scope.message = 'No user with that email.';
            }
            if (err == 'Invalid password') {
              $scope.message = 'Right email, wrong password, need link to change password here';
            }
          });
        }

      };
    });
