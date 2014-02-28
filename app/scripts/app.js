'use strict';

angular.module('wrdz', [
  'ngCookies',
  'ngResource',
  'ngAnimate',
  'ngSanitize',
  'ngRoute',
  'mgo-mousetrap',
  'perfect_scrollbar',
  'ui.bootstrap',
  'ui.router'
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