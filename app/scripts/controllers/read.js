'use strict';

/*
  Read View Controller

    
*/
angular.module('read')
  .controller('ReadCtrl', ['$scope', 'Read', '$state', '$filter', function ($scope, Read, $state, $filter) {

    // Implement if doc has been seen, appear very shaded
    if ($scope.user) {
      $scope.seen = $scope.user.meta._views;
    }

    $scope.$on('userChange', function (evt, user) {
      if (user) {
        $scope.seen = $scope.user.meta._views;
          $scope.init();

      }
    });

    $scope.topicsFilterModel;
    $scope.followingFilterModel = [];

    $scope.tabs = [
      { title: "Front"},
      { title: "Following"},
      { title: "Topics"}
    ];

    $scope.moment = moment;

    $scope.init = function () {
      Read.refreshTopics();
      angular.forEach($scope.user.following, function (user) {
        $scope.followingFilterModel.push(user._id);
      })
    }

    $scope.$watch(Read.getTopics, function (newValue) {
      if (newValue) {
        $scope.topTopics = newValue;
        $scope.topicsFilterModel = newValue[0];
      }
    });




    $scope.$watch('topicsFilterModel', function (newValue) {
      if (newValue && $scope.$state.current.name === 'read.list.topics') {      
        Read.updateQuery('topics', newValue._id);
      }
    });
    $scope.$watch('followingFilterModel', function (newValue) {
      if (newValue && $scope.$state.current.name === 'read.list.following') {      
        Read.updateQuery('following', newValue);
      }
    });

    $scope.$watch('$state.current.name', function (newValue) {
      if (newValue) {

        angular.forEach($scope.tabs, function (tab) {
          if ($filter('lowercase')(tab.title) === newValue.slice(10)) {
            console.log(newValue)
            tab.active = true;
          } else {
            tab.active = false;
          }
        })


        if (newValue === 'read.list.topics') {
          

        } else {
          Read.updateQuery('topics', '');

        }
        if (newValue === 'read.list.following') {
          
        } else {
          Read.updateQuery('following', '');
        }

      }
    })




    // to delete
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
    $scope.isFollowing = function () {
      if ($scope.readDoc.author) {

        if ($scope.user.following.indexOf($scope.readDoc.author._id) > -1) {
          $scope.following = true;
        } else {

          $scope.following = false;
        }
      }
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
      $scope.isFollowing();
    }


    if ($scope.user) {
      checkDoc();
    }

    $scope.$on('userChange', function (evt, user) {
      if (user) {
        checkDoc();
      }
    });


    $scope.follow = function () {
      if ($scope.readDoc.author) {

        if ($scope.following) {

          Read.followUser($scope.readDoc.author._id, false);
        } else {
          
          Read.followUser($scope.readDoc.author._id, true);
        }
        $scope.following = !$scope.following;
      }
    }

  }]);