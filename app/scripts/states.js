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
        url: '/f',
        templateUrl: 'partials/read-list-center.html',
        controller : ['$scope','Read', function ($scope, Read) {

          Read.updateQuery('following', '');
          Read.updateQuery('topics', '');
        }]

      })
      .state('read.list.following', {
        url: '/l/:userId',
        templateUrl: 'partials/read-list-center.html',
        resolve : {
          query : ['$stateParams','User', function ($stateParams, User) {
            if ($stateParams.userId) {
              return [$stateParams.userId];

            } else {
              var a = [];
              angular.forEach(User.getUser().following, function (user) {
                a.push(user._id);
              });
              return a;
            }
          }]
        },
        controller : ['$scope', 'query','Read', '$stateParams', function ($scope, query, Read, $stateParams) {

          $scope.$on('userChange', function (evt, user) {
            if (user && !$stateParams.userId) {
              var a = [];
              angular.forEach(user.following, function (user) {
                a.push(user._id);
              });
              Read.updateQuery('following', a)
            }
          });
          Read.updateQuery('topics', '');
          Read.updateQuery('following', query);
        }]

      })
      .state('read.list.topics', {
        templateUrl: 'partials/read-list-center.html',
        url: '/t/:topicId',
        resolve : {
          query : ['$stateParams', 'Read', '$state', function ($stateParams, Read, $state) {
            if ($stateParams.topicId) {
              return $stateParams.topicId;
            } else {
              
              
              Read.refreshTopics().then(function (res) {
                $state.go('read.list.topics',{topicId: res.data[0]._id}) 
              });
            }
          }]
        },
        controller : ['$scope', 'query','Read', function ($scope, query, Read) {
          Read.updateQuery('following', '');
          console.log('going query');
          if (query) {
            
            Read.updateQuery('topics', query);
          }
        }]
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

     // Password reset
     .state('password_reset', {
        url: '/password_reset',
        templateUrl: 'partials/reset-password.html'
     })


    }]);