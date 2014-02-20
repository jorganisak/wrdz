'use strict';

angular.module('wrdz')
.controller('ReadCtrl', function ($scope, Read, $state) {

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


});