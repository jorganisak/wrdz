'use strict';

angular.module('shared').
config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

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
        url: '/r',
        abstract: 'true',
        templateUrl: 'partials/read/read.html',
        controller: ['$scope', '$state', function ($scope, $state) {
          // $state.go('read.list');
        }]
      })
      .state('read.list', {
        url:'',
        templateUrl:'partials/read/read-list.html',
      })
      .state('read.list.front', {
        url: '',
        templateUrl: 'partials/read/read.html'
      })
      .state('read.list.new', {
        url: '/n',
        templateUrl: 'partials/read/read.html'
      })
      .state('read.list.following', {
        url: '/f',
        templateUrl: 'partials/read/read.html'
      })
      .state('read.list.topics', {
        url: '/t',
        templateUrl: 'partials/read/read.html'
      })

      .state('read.doc', {
        url: '/:docId',
        templateUrl: 'partials/read/read-doc.html',
        resolve: {
          readDoc : ['Read','$stateParams', function(Read, $stateParams) {
            return Read.getPubDoc($stateParams.docId);
          }]
        },
        controller: ['$scope', 'readDoc', function ($scope, readDoc) {
          $scope.readDoc = readDoc.data;
        }]

      })

/*
      WRITE
      */

      .state('write', {
        url: '/w',
        templateUrl: 'partials/write/write.html'
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
        url: '/t',
        templateUrl: 'partials/talk.html'
      })


    }]);