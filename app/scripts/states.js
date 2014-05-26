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

    //WRITE
    .state('write', {
      url: '/w',
      templateUrl: 'partials/write.html'
    })

    //ME
    .state('me', {
      url: '/m',
      templateUrl: 'partials/me.html',
    })

    // Password reset
    .state('password_reset', {
      url: '/password_reset?key',
      templateUrl: 'partials/password-reset.html',
      resolve: {
        email :  ['$cookieStore', '$stateParams', function ($cookieStore, $stateParams) {
          var cookie = $cookieStore.get('pwreset');
          if (cookie) {
            var id = cookie.id.slice(0, -2);
            var email = cookie.email;
            var key = $stateParams.key;
            if (id === key) {
              $cookieStore.remove('pwreset');
              return email;
            }
          }
          return false;
        }]
      },
      controller: ['$scope', 'email', 'User', '$state','$timeout',  function ($scope, email, User, $state, $timeout) {
        if (!email) {
          $scope.emailFail = true;
        }
        $scope.resetPass = function (newPass) {
          User.resetPassword(email, newPass).then(function (res) {
              console.log(res);
              $timeout(function () {
                $scope.launchLogIn();
              }, 1000)
          });
        }
      }]
    })
}]);