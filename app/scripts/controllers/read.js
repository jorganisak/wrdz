'use strict';

/*
  Read View Controller

    
*/
angular.module('read')
.controller('ReadCtrl', function ($scope, Read, $state, $stateParams, $filter ) {



  $scope.tabs = [
    { title:"Front"},
    { title:"New" },
    // { title:"Following" },
    { title:"Topics" }    
  ];


  // watches for url change and updates active tab
  $scope.$watch('$state.current.url', function  (newValue) {
    angular.forEach($scope.tabs, function  (tab) {
      if ($filter('lowercase')(tab.title) === $state.current.name.slice(5)) {
        tab.active = 'true';
      }
    });
  });

  $scope.moment = moment;

  Read.refreshDocs();

  function arrayTest (docId, a) {
    var res = false;
    angular.forEach(a, function  (item) {
      if (a == item) {
        res = true;
      }
    })
    return res;
  }

  if ($scope.user) {
    $scope.seen = $scope.user.meta._views;
  }

  $scope.$on('userChange', function  (evt, user) {
    if (user) {
      $scope.seen = $scope.user.meta._views;
    }
  });

  $scope.docs = Read.getDocs();

  $scope.$watch(Read.getDocs, function  (newValue, oldValue) {
    if (newValue) {
      console.log('loading new docs')
      $scope.docs = newValue;
    }
  });

})


.controller('ReadDocCtrl', function ($scope, PubDoc) {
  // body...

  $scope.isHeart = function  () {
    if ($scope.user.meta._hearts.indexOf($scope.readDoc._id) > -1) {
      $scope.active2 = 'active';
      return true;
    }
    return false;
  } 
  $scope.isVote = function  () {
    if ($scope.user.meta._up_votes.indexOf($scope.readDoc._id) > -1) {
      $scope.active1 = 'active';
      return true;
    }
    return false;
  }
  $scope.isRepost = function  () {
    if ($scope.user.meta._reposts.indexOf($scope.readDoc._id) > -1) {
      $scope.active3 = 'active';
      return true;
    }
    return false;
  }


  $scope.heart = function () {
    if ($scope.active2 == 'active') {
      $scope.readDoc.hearts--;
      $scope.active2 = null;
      PubDoc.update($scope.readDoc._id, 'heart', false);
    } else {
      $scope.active2 = 'active';
      PubDoc.update($scope.readDoc._id, 'heart', true);
      $scope.readDoc.hearts++;
    }
  };

  $scope.up_vote = function () {
    if ($scope.active1 == 'active') {
      $scope.readDoc.up_votes--;
      $scope.active1 = null;
      console.log($scope.active1);
      PubDoc.update($scope.readDoc._id, 'up_vote', false);
    } else {
      $scope.active1 = 'active';
      PubDoc.update($scope.readDoc._id, 'up_vote', true);
      $scope.readDoc.up_votes++;
    }
  };

  $scope.repost = function () {
    if ($scope.active3 == 'active') {
      $scope.readDoc.reposts--;
      $scope.active3 = null;
      PubDoc.update($scope.readDoc._id, 'repost', false);
    } else {
      $scope.active3 = 'active';
      PubDoc.update($scope.readDoc._id, 'repost', true);
      $scope.readDoc.reposts++;
    }
  }
  
  $scope.view = function () {
    // Check if user to register view
    // TODO, this can surely be worked around to
    // manufacture page views..
    if ($scope.user) {
      if ($scope.user.meta._views.indexOf($scope.readDoc._id) == -1) {

        PubDoc.update($scope.readDoc._id, 'view', true);
      }
    }
  };

  function checkDoc () {
    $scope.view();
    $scope.isHeart();
    $scope.isVote();
    $scope.isRepost();
  }


  if ($scope.user) {
    checkDoc();
  }

  $scope.$on('userChange', function  (evt, user) {
    if (user) {
      checkDoc();
    }
  });

});