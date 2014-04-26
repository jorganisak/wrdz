'use strict';

angular.module('shared').
config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      .state('landing', {
        url: '/',
        templateUrl: 'partials/landing.html',
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

      //FRONT
      .state('read.list.front', {
        url: '/f?sort',
        templateUrl: 'partials/read-list-center.html',
        resolve : {
          docs : ['Read','$stateParams', function (Read, $stateParams) {
              return Read.getDocs();
          }]
        },
        controller : ['$scope','docs','Read', '$state','$stateParams',
         function ($scope, docs, Read, $state, $stateParams) {
          $scope.hideStats = true;
          $scope.showUser = false;
          $scope.docs = docs.data;

          // Sorting mechanism;
          $scope.$watch('readFilter', function (newValue) {
            if (newValue) {
              if (newValue !== $stateParams.sort) {
                $stateParams.skip = null;
              }

              $state.go('read.list.front', {'skip': $stateParams.skip, 'sort': newValue})

            }
          })

          $scope.readFilter = $stateParams.sort;

        }]

      })
      .state('read.list.user', {
        templateUrl: 'partials/read-list-center.html',
        url: '/u/:userId?sort',
        resolve : {
          docs : ['$stateParams','User', 'Read', function ($stateParams, User, Read) {
            if ($stateParams.userId) {
              if (!$stateParams.sort) {
                $stateParams.sort = 'score';
              }

              return Read.updateQuery([{type:'following', 
                value: [$stateParams.userId]}, {type:'topics', value: ''}, 
                {type:'hearts', value: ''}, {type:'skip', value: $stateParams.skip}, 
                {type: 'sort', value: $stateParams.sort}]);

            } else {
              return false;
            }
          }]
        },
        controller : ['$scope', 'docs','Read', '$stateParams','$state', '$rootScope', 
          function ($scope, docs, Read, $stateParams, $state, $rootScope) {



            $scope.docs = docs.data;
            if ($scope.docs[0]) {
              
              if ($scope.docs[0].author._id === $stateParams.userId) {
                $scope.$emit('author_info', $scope.docs[0].author)
              }
            }

            $scope.$watch('readFilter', function (newValue) {
              if (newValue) {
                if (newValue !== $stateParams.sort) {
                  $stateParams.skip = null;
                }
                $state.go('read.list.user', {'userId':$stateParams.userId, 'skip': $stateParams.skip, 'sort': newValue})

              }
            })

            $scope.readFilter = $stateParams.sort;

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
        controller: ['$scope', 'readDoc','PubDoc', '$rootScope', 
        function ($scope, readDoc, PubDoc, $rootScope) {

          $scope.doc = readDoc.data;

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
        templateUrl: 'partials/me.html',
        abstract: 'true',
      })

      
      .state('me.profile', {
        url: '/profile',
        templateUrl: 'partials/me-settings.html'
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