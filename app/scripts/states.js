'use strict';

angular.module('shared').
config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

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


      /*
      READ
      */

      .state('read', {
        url: '/r',
        templateUrl: 'partials/read.html',
        abstract: 'true',

      })


      //FRONT
      .state('read.front', {
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
          Read.setDocs(docs.data);

          

          $scope.$on('new-read-docs', function (evt, docs) {
            $scope.docs = docs;
          })

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
      .state('read.user', {
        templateUrl: 'partials/read-list-center.html',
        url: '/u/:userId?sort',
        resolve : {
          data : ['$stateParams', 'Read', "User", function ($stateParams, Read, User) {
            if ($stateParams.userId) {
              var user = User.getOneUser($stateParams.userId);
              var docs = Read.getUser($stateParams.userId);
              var data = {user: user, docs: docs};
              return data;

            } else {
              return false;
            }
          }]
        },
        controller : ['$scope', 'data','Read', '$stateParams','$state', '$rootScope', 
          function ($scope, data, Read, $stateParams, $state, $rootScope) {



            data.user.then(function (user) {
              $scope.author = user.data.user;
            })
            data.docs.then(function (docs) {
              $scope.docs = docs.data;
            })

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