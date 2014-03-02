'use strict';

angular.module('shared').
config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // $urlRouterProvider.otherwise('/');

    $stateProvider

/*
      Sign Up
      */
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.html',
        controller: ['$scope', '$state', 'User',
        function ( $scope, $state, User ) {
          $scope.signup = function(user) {
            if (!User.isLoggedIn()){
              User.signup(user).
              success(function(user, status, headers, config)
              {
                User.changeUser(user);
                $state.go('read');
              }).
              error(function(err, status, headers, config)
              {
                console.log(err.errors.email.type);
                $scope.message = 'Something went wrong...someone probably already has that email on here.';
              });
            }
          };
        }
        ]
      })

/*
      Sign In
      */
      .state('signin', {
        url: '/signin',
        templateUrl: 'partials/signin.html',
        controller: ['$scope', '$state', 'User',
        function ( $scope, $state, User ) {
          $scope.signin = function(user) {
            if (!User.isLoggedIn()){
              User.signin(user).
              success(function(user, status, headers, config) {
                User.changeUser(user);
                $state.go('read');
              }).
              error(function(err, status, headers, config) {
                if (err == 'Unknown user') {
                  $scope.message = 'No user with that email.';
                }
                if (err == 'Invalid password') {
                  $scope.message = 'Right email, wrong password, need link to change password here';
                }
              });
            }

          };
        }
        ]
      })
      
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

      .state('read-doc', {
        url: '/r/:docId',
        templateUrl: 'partials/read-doc.html',
 
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

      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/me.html'
      })

      
      .state('profile.about', {
        url: '/about',
        templateUrl: 'partials/about.html'
      })

  /*
      TALK
      */

      .state('talk', {
        url: '/talk',
        templateUrl: 'partials/talk.html'
      })


    }]);