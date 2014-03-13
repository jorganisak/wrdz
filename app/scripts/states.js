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
        templateUrl: 'partials/read.html',
        abstract: 'true',
        controller: ['$scope', '$state', function ($scope, $state) {

        }]
      })
      .state('read.list', {
        url:'',
        templateUrl:'partials/read-list.html',
      })
      .state('read.list.front', {
        url: '',
        templateUrl: 'partials/read.html'
      })
      .state('read.list.new', {
        url: '/n',
        templateUrl: 'partials/read.html'
      })
      .state('read.list.following', {
        url: '/f',
        templateUrl: 'partials/read.html'
      })
      .state('read.list.topics', {
        url: '/t',
        templateUrl: 'partials/read.html'
      })

      .state('read.doc', {
        url: '/:docId',
        templateUrl: 'partials/read-doc.html',
        resolve: {  
          readDoc : ['Read','$stateParams', function(Read, $stateParams) {
            return Read.getPubDoc($stateParams.docId);
          }]
        },
        controller: ['$scope', 'readDoc','PubDoc', function ($scope, readDoc, PubDoc) {
          $scope.readDoc = readDoc.data;

        }]

      })

/*
      WRITE
      */

      .state('write', {
        url: '/w',
        templateUrl: 'partials/write.html'
      })


/*
      ME
      */

      .state('me', {
        url: '/m',
        templateUrl: 'partials/me.html'
      })

      
      .state('me.about', {
        url: '/about',
        templateUrl: 'partials/about.html'
      })

  /*
      My Wrdz
      */

      .state('mywrdz', {
        url: '/d',
        templateUrl: 'partials/mywrdz.html'
      })

     


    }]);