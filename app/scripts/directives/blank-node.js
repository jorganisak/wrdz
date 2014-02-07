'use strict';

angular.module('wrdz')
  .directive('blankNode', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        console.log("Blank node directive triggered");
        element.text('this is the blankNode directive');
      }
    };
  });
