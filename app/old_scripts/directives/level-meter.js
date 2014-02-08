'use strict';

angular.module('wrdz')
  .directive('levelMeter', function () {
    return {
      template: '<div ng-style="marginLeft" class="levelDot"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        /// THIS DOES NOT CHANGE WHEN YOU CHANGE NODES - JUST WHEN YOU CHANGE 
        /// THE LEVEL OF A NODE


        scope.$on('levelChange', function(evt, newValue){
          if (newValue === 1) {
            scope.marginLeft = { 'margin-left':'0%'}
          } else if (newValue === 2) {
            scope.marginLeft = { 'margin-left':'46%'}
          } else if (newValue === 3) {
            scope.marginLeft = { 'margin-left':'92%'}
          } 
        });


      }
    };
  });
