'use strict';

angular.module('wrdz')
.controller('ReadCtrl', function ($scope, Read, $state) {

  Read.refreshDocs();

  if ($scope.user) {
    $scope.seen = $scope.user.meta._views;
  }

  $scope.$on('userChange', function  (evt, user) {
    if (user) {
      $scope.seen = $scope.user.meta._views;
    }
  });

  $scope.docs = Read.getDocs();

  $scope.$watch(function  () {
    return Read.getDocs();
  }, function  (newValue, oldValue) {
    if (newValue) {
      $scope.docs = newValue;
    }
  });


});