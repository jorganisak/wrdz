'use strict';

angular.module('vendor', [
  'ngCookies',
  'ngResource',
  'ngAnimate',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.router',
  'infinite-scroll',
  'pickadate'
  ]);

angular.module('read', []);
angular.module('write', []);
angular.module('myWrdz', []);
angular.module('models', []);
angular.module('me', []);
angular.module('shared', []);


angular.module('wrdz', [

  'vendor',
  'read',
  'write',
  'myWrdz',
  'me',
  'read',
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
