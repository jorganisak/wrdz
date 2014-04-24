'use strict';
angular.module('shared')

.directive('twitterButton', ['$window', function($window) {
  return {
    restrict: 'AE',
    replace: true,
    controller: function ($scope, $window) {
      var open = function(docId) {
        console.log('going'); 
        var url = "https://twitter.com/intent/tweet?text=" + '' + "&url=" + 'http://wrdz.co/r/' + docId;
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
}])
