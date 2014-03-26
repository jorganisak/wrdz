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

.directive('twitterButton', ['$window', function($window) {
  return {
    restrict: 'AE',
    replace: true,
    controller: function ($scope, $window) {
      var open = function() {
        console.log('going'); 
        var url = "https://twitter.com/intent/tweet?text=" + '' + "&url=" + 'http://wrdz.herokuapp.com';
        var popup;
        popup = {
          width: 500,
          height: 350
        };
        popup.top = (screen.height / 2) - (popup.height / 2);
        popup.left = (screen.width / 2) - (popup.width / 2);
        $window.open(url, 'targetWindow', "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=" + popup.left + ",top=" + popup.top + ",width=" + popup.width + ",height=" + popup.height);
      };

      $scope.open = open;
    },

    link: function (scope, elem, attrs, ctrl) {

    }
  }
}]);