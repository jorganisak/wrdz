'use strict';

angular.module('wrdz')
  .controller('MainCtrl', function ($scope, User, $rootScope) {
    

    $scope.user = User.user ;



    // This function runs on initial load of the app from the MainCtrl
    // If a user cookie exists, it sets $scope.user, and gets all notes
    // belonging to this user, setting them to $scope.notes
    // if there is no user, it calls Notes.initNoUser, passing scope
    // // to the Notes service
    // $scope.init = function() {
    //   var user = User.isLoggedIn();
    //   if (user.email !== '') {
    //     $scope.user = user;
    //     Notes.getAllNotes().then(function(res) {
    //       $scope.notes = res.data;
    //       $scope.currentIndex = 0;
    //     });
    //   } else {
    //     Notes.initNoUser($scope);
    //   }
    // };

    // This recieves a broadcast signal from the User service when
    // login or logout happens during interaction with the app
    $scope.$on('userChange', function(event, user) {
      if (user) {
        $scope.user = user;
      } else {
        $scope.user = null;
      }
    });

    // // call init()
    // $scope.init();




  });
