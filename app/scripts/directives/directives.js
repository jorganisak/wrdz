'use strict';
angular.module('shared').directive('writeUnit', function() {
  return {
    restrict: 'AE',
    controller: ['$scope', '$timeout', 'Write', function ($scope, $timeout, Write) {

    }],

    link: function (scope, elem, attrs, ctrl) {
      
    }

  }
})
angular.module('shared').directive('docDate', function() {
  return {
    restrict: 'AE',
    scope: {
      date: '@date',
      datesShowing: "=datesShowing" 
    },
    link: function (scope, elem, attrs, ctrl) {
      scope.show = false;
      var datef = moment(scope.date).format("MMMM DD, YYYY");
      if (scope.datesShowing.indexOf(datef) === -1) {
        scope.show = true;
        scope.datesShowing.push(datef);
        elem.text(datef);
      }
    }

  }
})
