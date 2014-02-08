'use strict';

angular.module('wrdz').
  config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
    
    // $urlRouterProvider.otherwise('/');


    $stateProvider
      
/*
      LANDING
*/
      .state('landing', {
        url: '/',
        templateUrl: 'partials/landing.html'
      })


/*
      READ
*/

      .state('read', {
        url: '/read',
        templateUrl: 'partials/read.html'
      })

/*
      WRITE
*/
  
      .state('write', {
        url: '/write',
        templateUrl: 'partials/write.html'
      })


  
/*
      ME
*/

      .state('me', {
        url: '/me',
        templateUrl: 'partials/me.html'
      })

  }]);