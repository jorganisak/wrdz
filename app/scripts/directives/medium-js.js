'use strict';
angular.module('wrdz').directive('mediumEditor', function ($timeout) {
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
      iElement.on('blur keypress keydown keyup change focus', function () {
        scope.$apply(function () {
          if (iElement.html() == '<p><br></p>' || iElement.html() == '' || iElement.html() =='<br>') {
            opts.placeholder = placeholder;
            var editor = new MediumEditor(iElement, opts);
          }
          $timeout(function  () {
            ctrl.$setViewValue(iElement.html());
          },100)
        });
      });
      ctrl.$render = function () {
        

        if (!editor) {
          
          if (!ctrl.$isEmpty(ctrl.$viewValue)) {
            console.log('not empty so no placeholder');
            opts.placeholder = '';
            iAttrs.$set('data-placeholder', '');
          } else {
            iAttrs.$set('data-placeholder', angular.fromJson(iAttrs.options).placeholder);
          }
          console.log('making editor')
          var editor = new MediumEditor(iElement, opts);
        }
        iElement.html(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
      };
    }
  };
});