'use strict';

angular.module('wrdz', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'mgo-mousetrap',
  'perfect_scrollbar'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  });