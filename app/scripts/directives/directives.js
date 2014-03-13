'use strict';
angular.module('shared').directive('joInputAdd', function () {
  return {
    restrict: 'AE',
    templateUrl: 'partials/input-add.html',
    scope: {
      name: '@name',
      onSubmit: '&onSubmit'
    },
    controller: function ($scope) {
      $scope.add = function (input) {
        $scope.input = '';
        $scope.onSubmit({'title' : input});
        document.getElementById('input-add').focus()
      }
    },
    link: function (scope, elem, attrs, ctrl) {
      document.getElementById('input-add').focus()
    }
  };
})

.directive('joTopicLabel', function() {
  return {
    restrict: 'AE',
    templateUrl: 'partials/input-add.html',
    scope: {
      name: '@name',
      onSubmit: '&onSubmit'
    },
    controller: function ($scope) {
      $scope.add = function (input) {
        $scope.input = '';
        $scope.onSubmit({'title' : input});
        document.getElementById('input-add').focus()
      }
    },
    link: function (scope, elem, attrs, ctrl) {
      document.getElementById('input-add').focus()
    }
  }
})

.directive('joClickCounter', function() {
  return {
    restrict: 'AE',
    replace: true,

    link: function (scope, elem, attrs, ctrl) {

      scope.switch = function () {
        console.log(elem);
        if (elem.hasClass('active')) elem.removeClass('active')
        else elem.addClass('active');
      };



    }
  }
});