'use strict';

angular.module('wrdz')
  .controller('MainCtrl', function ($scope, User, $rootScope) {
    
/*
Does a few things:
  1. when loaded checks to see if user is logged in
  2. if it is a cookie of a user then it calls to get full user
  3. assigns the full user to $scope.user
  4. listener at the bottom for changes like login/signup/logout

  */


    function getUser () {
      var u = User.isLoggedIn();
      var result;
      if (u && !u.messages) {
        User.getCurrentUser(u._id).success(function  (data) {
          User.changeUser(data.user);
        }).error(function  (data) {
          console.log(data);
        });
      }

    }

    getUser();

    // This recieves a broadcast signal from the User service when
    // login or logout happens during interaction with the app
    $scope.$on('userChange', function(event, user) {
      if (user) {
        $scope.user = user;
      } else {
        $scope.user = null;
      }
    });

  });
