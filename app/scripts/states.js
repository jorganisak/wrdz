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
        templateUrl: 'partials/read/read.html'
      })
      .state('read.front', {
        url: '',

        templateUrl: 'partials/read/read.html'
      })
      .state('read.new', {
        url: '/n',
        templateUrl: 'partials/read/read.html'
      })
      .state('read.following', {
        url: '/f',
        templateUrl: 'partials/read/read.html'
      })
      .state('read.topics', {
        url: '/t',
        templateUrl: 'partials/read/read.html'
      })

      .state('read.doc', {
        url: '/:docId',
        templateUrl: 'partials/read/read-doc.html',

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