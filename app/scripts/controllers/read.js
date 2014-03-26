'use strict';

/*
  Read View Controller

    
*/
angular.module('read')
  .controller('ReadCtrl', ['$scope', 'Read', '$state', '$filter', function ($scope, Read, $state, $filter) {


    $scope.Read = Read;


    $scope.tabs = [
      { title: "Front", state: "read.list.front({'skip': null})"},
      { title: "Following", state: "read.list.following({'skip': null})"},
      { title: "Topics", state: "read.list.topics({'skip': null})"}
    ];

    $scope.navType = 'pills';

    $scope.moment = moment;



    $scope.$watch('$state.current.name', function (newValue) {
      if (newValue) {
        angular.forEach($scope.tabs, function (tab) {
          if ($filter('lowercase')(tab.title) === newValue.slice(10)) {
            tab.active = true;
          } else {
            tab.active = false;
          }
        })
      }
    })

    $scope.loadNext = function () {
        var skip = Number($scope.$stateParams.skip) + 10;
        $scope.$state.go($scope.$state.current.name, {'skip' : skip})

    };

    $scope.loadPrev = function () {
        var skip = Number($scope.$stateParams.skip) - 10;
        $scope.$state.go($scope.$state.current.name, {'skip' : skip})

    };

    // Things for read.list.user, maybe eventually move to another controller

    $scope.$on('read_list_author_info', function (evt, author) {
      console.log('author')
      $scope.author_info = author;


      if ($scope.user) {
        testFollow(author._id);
      }
    })


    $scope.$on('userChange', function (evt, user) {
      if (user) {
        if ($scope.author_info) {

          testFollow($scope.author_info._id);
        }
      }
    });

    function testFollow (id) {
       var flag = false;
        angular.forEach($scope.user.following, function (user) {
          if (user._id === id){
            flag = true;
          }
        })
        if (flag) {
          $scope.following = true;
        } else {
          $scope.following = false;
        }
    }

    function checkUser () {
      if ($scope.user) {
        return true;
      } else {
        $scope.launchSignUp();

      }
    }

    $scope.follow = function () {
      if (checkUser()) {

        if ($scope.author_info) {

          if ($scope.following) {

            Read.followUser($scope.author_info._id, false);
            $scope.author_info.followers--;
          } else {
            
            Read.followUser($scope.author_info._id, true);
            $scope.author_info.followers++;
          }
          $scope.following = !$scope.following;
        }
      }
    }


  }])

  .controller('UsersListCtrl', ['$scope', 'Read', function ($scope, Read) {
   
    
  }])

  .controller('TopicsListCtrl', ['$scope', 'Read', function ($scope, Read) {
    var topTopics;
    var init = function () {
      Read.refreshTopics().then(function (topics) {
        topTopics = topics.data;
        for (var i=0; i<topTopics.length ; i++) {
          $scope.data.push(topTopics[i]);
        }
      });
    }

    init();

    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.data = [];
    $scope.numberOfPages = function(){
      return Math.ceil($scope.data.length/$scope.pageSize);                
    }
    
  }])



  .controller('ReadDocCtrl', ['$scope', 'Read', function ($scope, Read) {
    $scope.isCollapsed = true;

    $scope.nextDoc = function () {
      Read.goToNextDoc();
    };

    $scope.goBack = function () {
      Read.goBack();
    };



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
        var flag = false;
        angular.forEach($scope.user.following, function (user) {
          if (user._id === $scope.readDoc.author._id){
            flag = true;
          }
        })

        if (flag) {

          $scope.following = true;

        } else {

          $scope.following = false;
        }
      }
    };

    $scope.heart = function () {
      if (checkUser()) {
        
        if ($scope.active2 === 'active') {
          $scope.readDoc.hearts--;
          $scope.active2 = null;
          Read.updatePubDoc($scope.readDoc._id, 'heart', false);
        } else {
          $scope.active2 = 'active';
          Read.updatePubDoc($scope.readDoc._id, 'heart', true);
          $scope.readDoc.hearts++;
        }
      }
    };

    $scope.up_vote = function () {
      if (checkUser()) {

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

    function checkUser () {
      if ($scope.user) {
        return true;
      } else {
        $scope.launchSignUp();

      }
    }




    $scope.follow = function () {
      if (checkUser()) {

        if ($scope.readDoc.author) {

          if ($scope.following) {

            Read.followUser($scope.readDoc.author._id, false);
            $scope.readDoc.author.followers--;
          } else {
            
            Read.followUser($scope.readDoc.author._id, true);
            $scope.readDoc.author.followers++;
          }
          $scope.following = !$scope.following;
        }
      }
    }

  }]);