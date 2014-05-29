'use strict';

angular.module('shared').
config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

  .state('landing', {
    url: '/',
    templateUrl: 'partials/landing.html',
    controller: ['$scope', '$state', function ($scope, $state) {
      if ($scope.user) $state.go('write');
      $scope.$on('userChange', function (evt, user) {
          if (user) {
            $state.go('write');
          }
        });
      }]
    })

    .state('twitter', {
      url: '/auth/twitter',
      templateUrl: 'partials/landing.html',
      controller: ['$scope', '$timeout', function ($scope, $timeout) {
        $timeout(function () {
          location.reload(true);
        }, 100)
      }]

    })
    .state('google', {
      url: '/auth/google',
      templateUrl: 'partials/landing.html',
      controller: ['$scope', '$timeout', function ($scope, $timeout) {
        $timeout(function () {
          location.reload(true);
        }, 100)
      }]

    })

    //WRITE
    .state('write', {
      url: '/w',
      templateUrl: 'partials/write.html'
    })
}]);