'use strict';

/*
  Read View Controller

    
*/
angular.module('read')
.controller('ReadCtrl', function ($scope, Read, $state, PubDoc, $stateParams, $rootScope, $filter ) {



  $scope.tabs = [
    { title:"Front"},
    { title:"New" },
    { title:"Following" },
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

  $scope.isHeart = function  () {
    
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


  //
    // FOR READ ITEM VIEW




});