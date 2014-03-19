'use strict';
angular.module('wrdz').directive('shareButton', ['$window', function ($window) {
  return {
    restrict: 'AE',
    link: function (scope, iElement, iAttrs, ctrl) {
      angular.element(iElement).addClass('share-button');
      var opts = {};
      if (iAttrs.options) {
        opts = angular.fromJson(iAttrs.options);
      }

      console.log($window.location.href)
      new Share(".share-button", {
        url : $window.location.href
      });



    }
  };
}]);