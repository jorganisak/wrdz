'use strict';

angular.module('shared').
config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider


    .state('picture-test', {
        url: '/pic-test',
        templateUrl: 'partials/picture-test.html',
        
      })
      
/*
      LANDING
      */
    // .state('landing', {
    //     url: '/',
    //     templateUrl: 'partials/landing.html',
    //     controller : ['$scope','$state', function ($scope, $state) {

    //         $state.go('write')
          

    //     }]
    //   })

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
        url: '/f?skip?sort',
        templateUrl: 'partials/read-list-center.html',
        resolve : {
          docs : ['Read','$stateParams', function (Read, $stateParams) {
            return Read.updateQuery([{type:'topics', value: ''}, 
              {type:'following', value: ''}, {type:'hearts', value: ''}, 
              {type:'skip', value: $stateParams.skip}, {type: 'sort', value: $stateParams.sort}]);
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
      //FOLLOWING
      .state('read.list.following', {
        url: '/l/:userId?skip?sort',
        templateUrl: 'partials/read-list-center.html',
        resolve : { 
          docs : ['$stateParams','User', 'Read', function ($stateParams, User, Read) {
            if ($stateParams.userId) {
              return Read.updateQuery([{type:'following', 
                value: [$stateParams.userId]}, {type:'topics', value: ''}, 
                {type:'skip', value: $stateParams.skip}, {type: 'sort', value: $stateParams.sort}]);

            } else {
              var a = [];
              angular.forEach(User.getUser().following, function (user) {
                a.push(user._id);
              });
              if (!a.length) {
                return false;
              }
              return Read.updateQuery([{type:'following', 
                value: a}, {type:'hearts', value: ''}, {type:'topics', value: ''}, 
                {type:'skip', value: $stateParams.skip}, {type: 'sort', value: $stateParams.sort}]);
            }
          }]
        },
        controller : ['$scope', 'docs','Read', '$stateParams','$state', 
          function ($scope, docs, Read, $stateParams, $state) {
            $scope.hideStats = true;
            $scope.showUser = false;

            function update (user) {
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
                    value: a}, {type:'topics', value: ''}, {type:'hearts', value: ''},
                    {type:'skip', value: $stateParams.skip}, {type: 'sort', value: $stateParams.sort}])
                    .then(function (res) {
                        $scope.docs = res.data;
                      })
                }
              }
            }

            $scope.$on('userChange', function (evt, user) {
              update(user);

            });

          $scope.$watch('readFilter', function (newValue) {
            if (newValue) {
              if (newValue !== $stateParams.sort) {
                $stateParams.skip = null;
              }
              $state.go('read.list.following', {'skip': $stateParams.skip, 'sort': newValue})

            }
          })

            $scope.readFilter = $stateParams.sort;

            $scope.docs = docs.data;
          }]

      })
      .state('read.list.hearts', {
        url: '/h?skip?sort',
        templateUrl: 'partials/read-list-center.html',
        resolve : { 
          docs : ['$stateParams','User', 'Read', function ($stateParams, User, Read) {
              var res = Read.getHearts();
              if (res) {
                if (!res.length) {
                  return false;
                }
                return Read.updateQuery([{type:'hearts', 
                  value: res}, {type:'following', value: ''},{type:'topics', value: ''}, 
                  {type:'skip', value: $stateParams.skip}, {type: 'sort', value: $stateParams.sort}]);
              } else {
                return true;
              }

          }]
        },
        controller : ['$scope', 'docs','Read', '$stateParams','$state', 
          function ($scope, docs, Read, $stateParams, $state) {

            function update () {
              var h = Read.getHearts();
                Read.updateQuery([{type:'hearts', 
                  value: h }, {type:'topics', value: ''}, {type:'following', value: ''},
                  {type:'skip', value: $stateParams.skip}, {type: 'sort', value: $stateParams.sort}])
                  .then(function (res) {
                      console.log(res.data);
                      $scope.docs = res.data;
                    })
            }

            $scope.$on('userChange', function (evt, user) {
              if (user) {
                update()
              }
            });

            $scope.$watch('readFilter', function (newValue) {
              if (newValue) {
                if (newValue !== $stateParams.sort) {
                  $stateParams.skip = null;
                }
                $state.go('read.list.hearts', {'skip': $stateParams.skip, 'sort': newValue})

              }
            })

            $scope.readFilter = $stateParams.sort;
            $scope.docs = docs.data;
          }]

      })
      // .state('read.list.topics', {
      //   templateUrl: 'partials/read-list-center.html',
      //   url: '/t/:topicId',
      //   resolve : {
      //     docs : ['$stateParams', 'Read', '$state', function ($stateParams, Read, $state) {
      //       if ($stateParams.topicId) {
      //         return Read.updateQuery([{type:'following', 
      //           value: ''}, {type:'topics', value: $stateParams.topicId}, 
      //           {type:'skip', value: ''}, {type: 'sort', value: 'score'}]);
      //       } else {

      //         Read.refreshTopics().then(function (res) {
      //           $state.go('read.list.topics',{topicId: res.data[0]._id}) 
      //         });
      //       }
      //     }]
      //   },
      //   controller : ['$scope', 'docs', 'Read','$state', function ($scope, docs, Read, $state) {

      //     if (docs) {
      //       $scope.docs = docs.data;
      //     }
      //   }]
      // })
      .state('read.list.user', {
        templateUrl: 'partials/read-list-center.html',
        url: '/u/:userId?skip?sort',
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

          var title = '';
          if ($scope.doc.doc.has_title) {
            title = $scope.doc.doc.title;
          } else {
            title = $scope.doc.doc.sample.slice(0, 20)
          }

          $rootScope.$broadcast('changePageTitle', title);

        }]

      })

/*
      WRITE
      */

      .state('write', {
        url: '/',
        templateUrl: 'partials/write.html'
      })

  /*
      My Wrdz
      */

      .state('mywrdz', {
        url: '/d',
        templateUrl: 'partials/mywrdz.html'
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