'use strict';

/*
  Read View Controller
*/

angular.module('read')
  .controller('ReadCtrl', ['$scope', 'Read', '$window', '$timeout',
   function ($scope, Read, $window, $timeout) {

    //Internal
    $scope.Read = Read;

    $scope.moment = moment;



  }])


  .controller('ReadDocCtrl', ['$scope', 'Read', function ($scope, Read) {




    $scope.isVote = function () {
      if ($scope.user.meta._up_votes.indexOf($scope.doc._id) > -1) {
        $scope.active1 = true
        return true;
      }
      else {
        $scope.active1 = false;
        return false;
      }
    };



    $scope.up_vote = function () {
      if (checkUser()) {

        if ($scope.active1 === true) {
          $scope.doc.up_votes--;
          $scope.active1 = false;
          Read.updatePubDoc($scope.doc._id, 'up_vote', false);
        } else {
          $scope.active1 = true;
          Read.updatePubDoc($scope.doc._id, 'up_vote', true);
          $scope.doc.up_votes++;
        }
      }
    };




    function checkDoc() {
      $scope.isVote();
    }


    if ($scope.user) {
      checkDoc();
    }

    $scope.$on('userChange', function (evt, user) {
      if (user) {
        checkDoc();
      }
    });

    function checkUser () {
      if ($scope.user) {
        return true;
      } else {
        $scope.launchSignUp();
      }
    }

  

  }]);