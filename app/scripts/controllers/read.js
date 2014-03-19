'use strict';

/*
  Read View Controller

    
*/
angular.module('read')
  .controller('ReadCtrl', ['$scope', 'Read', '$state', '$filter', function ($scope, Read, $state, $filter) {

    $scope.tabs = [
      { title: "Front"},
      { title: "New"},
      { title: "Following"},
      { title: "Topics"}
    ];


    // watches for url change and updates active tab
    $scope.$watch('$state.current.url', function () {
      angular.forEach($scope.tabs, function (tab) {
        if ($filter('lowercase')(tab.title) === $state.current.name.slice(5)) {
          tab.active = 'true';
        }
      });
    });

    $scope.moment = moment;



    if ($scope.user) {
      $scope.seen = $scope.user.meta._views;
    }

    $scope.$on('userChange', function (evt, user) {
      if (user) {
        $scope.seen = $scope.user.meta._views;
      }
    });


    Read.refreshDocs();
    $scope.docs = Read.getDocs();

    $scope.$watch(Read.getDocs, function (newValue) {
      if (newValue) {
        $scope.docs = newValue;
      }
    });
  }])


  .controller('ReadDocCtrl', ['$scope', 'Read', function ($scope, Read) {

    $scope.isHeart = function () {
      if ($scope.user.meta._hearts.indexOf($scope.readDoc._id) > -1) {
        $scope.active2 = 'active';
        return true;
      }
      return false;
    };
    $scope.isVote = function () {
      if ($scope.user.meta._up_votes.indexOf($scope.readDoc._id) > -1) {
        $scope.active1 = 'active';
        return true;
      }
      return false;
    };



    $scope.heart = function () {
      if ($scope.active2 === 'active') {
        $scope.readDoc.hearts--;
        $scope.active2 = null;
        Read.updatePubDoc($scope.readDoc._id, 'heart', false);
      } else {
        $scope.active2 = 'active';
        Read.updatePubDoc($scope.readDoc._id, 'heart', true);
        $scope.readDoc.hearts++;
      }
    };

    $scope.up_vote = function () {
      if ($scope.active1 === 'active') {
        $scope.readDoc.up_votes--;
        $scope.active1 = null;
        console.log($scope.active1);
        Read.updatePubDoc($scope.readDoc._id, 'up_vote', false);
      } else {
        $scope.active1 = 'active';
        Read.updatePubDoc($scope.readDoc._id, 'up_vote', true);
        $scope.readDoc.up_votes++;
      }
    };


    $scope.view = function () {
      // Check if user to register view
      // TODO, this can surely be worked around to
      // manufacture page views..
      if ($scope.user) {
        if ($scope.user.meta._views.indexOf($scope.readDoc._id) === -1) {
          Read.updatePubDoc($scope.readDoc._id, 'view', true);
        }
      }
    };

    function checkDoc() {
      $scope.view();
      $scope.isHeart();
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

  }]);