'use strict';

angular.module('wrdz')
  .directive('mediumJs', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        if (attrs.id === 'write-title') {
new Medium({
    element: document.getElementById('write-title'),
    mode: 'inline',
    maxLength: 25,
    placeholder: 'Your Title'
});
        }
        
        if (attrs.id === 'write-body') {
          new Medium({
    element: document.getElementById('write-body'),
    mode: 'rich',
    placeholder: 'Your Article'
});
        }
      }
    };
  });
