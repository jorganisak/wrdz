'use strict';

angular.module('vendor', [
  'ngCookies',
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap',
  'ui.router',
]);

angular.module('write', []);
angular.module('models', []);
angular.module('shared', []);

angular.module('wrdz', [
  'vendor',
  'write',
  'models',
  'shared'
])
  .config( function($locationProvider) {
    $locationProvider.html5Mode(true);
  } )
  .run(
    ['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]
);
