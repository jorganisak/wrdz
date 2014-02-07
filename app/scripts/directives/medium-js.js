'use strict';

angular.module('wrdz')
  .directive('mediumJs', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        
      }
    };
  });
