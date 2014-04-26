'use strict';



angular.module('shared').controller('NavCtrl', ['$scope', '$timeout',
  function ($scope, $timeout) {
    $scope.showNav = false;


    $scope.expandNav = function () {
      if ($scope.showNav === false) {

        $scope.showNav = true;

      } else {
        $scope.showNav = false;
      }
    };

    $scope.$on('bodyClick', function () {
        $scope.showNav = false;
    });




}])
