'use strict';
angular.module('wrdz').directive('mediumEditor', function () {
  return {
    require: 'ngModel',
    restrict: 'AE',
    link: function (scope, iElement, iAttrs, ctrl) {
      angular.element(iElement).addClass('angular-medium-editor');
      var opts = {};
      if (iAttrs.options) {
        opts = angular.fromJson(iAttrs.options);
      }
      var placeholder = opts.placeholder || 'Type here';
      iElement.on('blur keypress', function () {
        scope.$apply(function () {
          if (iElement.html() == '<p><br></p>') {
            opts.placeholder = placeholder;
            var editor = new MediumEditor(iElement, opts);
          }
          ctrl.$setViewValue(iElement.html());
        });
      });
      ctrl.$render = function () {
        

        if (!editor) {
          console.log('making editor')
          
          if (!ctrl.$isEmpty(ctrl.$viewValue)) {
            console.log('not empty so no placeholder');
            opts.placeholder = '';
          }
          console.log(opts);
          var editor = new MediumEditor(iElement, opts);
        }
        iElement.html(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
      };
    }
  };
});