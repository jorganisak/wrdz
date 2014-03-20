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

      new Share(".share-button", {
        ui : {

          flyout: 'bottom right'
        }
      });



    }
  };
}]);