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
        templateUrl: 'partials/landing.html',
        controller : ['$scope','$state', function ($scope, $state) {
          $scope.$on('userChange', function(event, user) {
            if (user) {
              $state.go('write')
            } else {

            }
          });
        }]
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
        url: '/f?skip',
        templateUrl: 'partials/read-list-center.html',
        resolve : {
          docs : ['Read','$stateParams', function (Read, $stateParams) {
            return Read.updateQuery([{type:'topics', value: ''}, 
              {type:'following', value: ''}, {type:'skip', value: $stateParams.skip}]);
          }]
        },
        controller : ['$scope','docs','Read', '$state', function ($scope, docs, Read, $state) {
          Read.setPrevState($state);
          $scope.docs = docs.data;
        }]

      })
      .state('read.list.following', {
        url: '/l/:userId',
        templateUrl: 'partials/read-list-center.html',
        resolve : { 
          docs : ['$stateParams','User', 'Read', function ($stateParams, User, Read) {
            if ($stateParams.userId) {
              return Read.updateQuery([{type:'following', 
                value: [$stateParams.userId]}, {type:'topics', value: ''}, {type:'skip', value: ''}]);

            } else {
              var a = [];
              angular.forEach(User.getUser().following, function (user) {
                a.push(user._id);
              });
              if (!a.length) {
                return false;
              }
              return Read.updateQuery([{type:'following', 
                value: a}, {type:'topics', value: ''}, {type:'skip', value: ''}]);
            }
          }]
        },
        controller : ['$scope', 'docs','Read', '$stateParams','$state', 
          function ($scope, docs, Read, $stateParams, $state) {
          
            $scope.$on('userChange', function (evt, user) {
              if (user && !$stateParams.userId) {
                var a = [];
                angular.forEach(user.following, function (user) {
                  a.push(user._id);
                });
                if (!a.length) {
                  console.log('not following')
                  $scope.docs = [];
                } else {

                  Read.updateQuery([{type:'following', 
                    value: a}, {type:'topics', value: ''}, 
                    {type:'skip', value: ''}]).then(function (res) {
                      $scope.docs = res.data;
                    })
                }
              }
            });
            Read.setPrevState($state);

            $scope.docs = docs.data;
          }]

      })
      .state('read.list.topics', {
        templateUrl: 'partials/read-list-center.html',
        url: '/t/:topicId',
        resolve : {
          docs : ['$stateParams', 'Read', '$state', function ($stateParams, Read, $state) {
            if ($stateParams.topicId) {
              return Read.updateQuery([{type:'following', 
                value: ''}, {type:'topics', value: $stateParams.topicId}, 
                {type:'skip', value: ''}]);
            } else {

              Read.refreshTopics().then(function (res) {
                $state.go('read.list.topics',{topicId: res.data[0]._id}) 
              });
            }
          }]
        },
        controller : ['$scope', 'docs', 'Read','$state', function ($scope, docs, Read, $state) {

          if (docs) {
            Read.setPrevState($state);
            $scope.docs = docs.data;
          }
        }]
      })
      .state('read.list.user', {
        templateUrl: 'partials/read-list-center.html',
        url: '/u/:userId',
        resolve : {
          docs : ['$stateParams','User', 'Read', function ($stateParams, User, Read) {
            if ($stateParams.userId) {
              return Read.updateQuery([{type:'following', 
                value: [$stateParams.userId]}, {type:'topics', value: ''}, {type:'skip', value: ''}]);

            } else {
              return false;
            }
          }]
        },
        controller : ['$scope', 'docs','Read', '$stateParams','$state', '$rootScope', 
          function ($scope, docs, Read, $stateParams, $state, $rootScope) {
          

            Read.setPrevState($state);

            $scope.docs = docs.data;
            if ($scope.docs[0]) {
              
              if ($scope.docs[0].author._id === $stateParams.userId) {
                $scope.$emit('read_list_author_info', $scope.docs[0].author)
              }
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
        templateUrl: 'partials/me.html',
        abstract: 'true',
      })

      
      .state('me.profile', {
        url: '/profile',
        templateUrl: 'partials/me-settings.html'
      })
       .state('me.following', {
        url: '/f',
        templateUrl: 'partials/me-following.html',
        controller: ['$scope', 'User', function ($scope, User) {

          $scope.unfollow = function (id) {
            var data = {userId: id, bool : false};
            User.update('addFollowing', data);
            angular.forEach($scope.user.following, function (user) {
              if (user._id === id) {
                $scope.user.following.splice($scope.user.following.indexOf(user), 1);
              }
            })
          }
  
        }]
 
      })
      
      .state('me.hearts', {
        url: '/hearts',
        templateUrl: 'partials/me-hearts.html',
        resolve: {
          docs : ['Me','$state', function (Me, $state) {
            var i = Me.getHearts();
            if (i) {

              return i;
            } else {
              return true;
            }
          }]
        },
        controller : ['$scope', 'docs', 'Me', function ($scope, docs, Me) {


          $scope.currentPage = 0;
          $scope.pageSize = 6;
          $scope.data = [];
          $scope.numberOfPages = function(){
            return Math.ceil($scope.data.length/$scope.pageSize);                
          }
          var init = function (docs) {

            if (docs.data) {
              for (var i=0; i<docs.data.length ; i++) {
                $scope.data.push(docs.data[i]);
              }
              
            }

        
          }

          init(docs);



          $scope.$on('userChange', function (evt, user) {
              if (user) {
                
                var i = Me.getHearts()
                i.then(function (res) {
                  init(res)

                })

            
       
              }
            });



        }]

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