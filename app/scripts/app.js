'use strict';

angular.module('wrdz', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'mgo-mousetrap',
  'perfect_scrollbar',
  'ui.router',
  'contenteditable'
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