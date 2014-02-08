'use strict';

angular.module('wrdz')
  .directive('nodeFunctions', function () {
    return {
      templateUrl: 'partials/node-functions',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.node_functions_active = false;

        scope.$watch('currentNode', function(newValue, oldValue) {

          var el = document.getElementById('node'+newValue);
          if (el) {
            scope.node_functions_active = true;
            scope.top = {top: el.getBoundingClientRect().top + 16};

            // console.log(el.getBoundingClientRect().top);
            // console.log(element.position());
          }


        });


      }
    };
  });
