'use strict';

angular.module('shared')
.controller('MainCtrl', ['$scope', 'User', '$modal', '$window','$timeout', function ($scope, User, $modal, $window, $timeout) {




    $scope.pageTitle = 'wrdz';

    $scope.landingCopy = "<h4 style='text-align:center'>Welcome to Wrdz</h4><p><br></p><p><span style='font-size: 22px; line-height: 1.25;'>This is a web app that provides a simple and clean place to write. <br><br> <strong>(Try highlighting this text.)</strong></span><br><br></p><p><em>With Wrdz, you can:&nbsp;</em></p><p></p><ul><li>Write whatever's in your head</li><li>Easily browse and organize by date and tag</li><li>Share your writing, anonymously if you'd like</li></ul>"
    
    $scope.mediumEditorOptionsBody = angular.toJson(
      {"placeholder": "",
        "buttons": ["bold", "italic", "anchor", "header2", "orderedlist", "unorderedlist" ],
        "buttonLabels" : {"header2": "<b>H</b>", "anchor": "<span><span class='icon ion-link'></span></span>",
         "bold":"<strong>B</strong>", "italic": "<em>i</em>"},
        "disableToolbar": false,
        "forcePlainText" : false,
        "targetBlank": true}
    );


    function getUser () {
      var u = User.getUser();
      // gets full user, messages check is to make sure the user is not already complete
      if (u && !u._userDocs) {
        User.getCurrentUser(u._id).success(function  (data) {
          User.changeUser(data.user);
        }).error(function  (data) {
        });
      }
    }


    getUser();

    // This recieves a broadcast signal from the User service when
    // login or logout happens during interaction with the app
    $scope.$on('userChange', function(event, user) {
      if (user) {
        $scope.user = user;
      } else {
        $scope.user = null;
      }
    });


    $scope.goToTop = function () {
      $window.scrollTo(0, 0);
    };

    $scope.local_auth_form = false;





// Everything below is auth related or the about modal


/*
  Two Auth methods for launching Login and Signup modals from anyhere in the app
  They launch modals and call the User service for commnication with server
*/
    $scope.launchEmailLogin = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/email-login.html",
        controller: ['$scope', '$modalInstance', 'User', function  ($scope, $modalInstance, User) {
          $scope.close = function() {
            $modalInstance.close();
          }; 
          $scope.signin = function(user) {
            if (!User.isLoggedIn()){
              User.signin(user).
              success(function(user, status, headers, config) {
                User.getCurrentUser(user._id).success(function  (data) {
                    User.changeUser(data.user);
                    $scope.close();
                    $scope.$state.go('write');
                  }).error(function  (data) {
                  });
              }).
              error(function(err, status, headers, config) {
                if (err == 'Unknown user') {
                  $scope.message = 'No one has that username on wrdz!';
                }
                if (err == 'Invalid password') {
                  $scope.message = 'Right username, wrong password...';
                }
              });
            }
          };

          $scope.signup = function (user) {
            if (!User.isLoggedIn()) {
              User.signup(user).
              success(function(user, status, headers, config)
              {
                User.getCurrentUser(user._id).success(function  (data) {
                  User.changeUser(data.user);
                  $scope.close();
                  $scope.$state.go('write');
                }).error(function  (data) {
                  });
              }).
              error(function(err, status, headers, config)
              {
                if (err.errors.username.type === 'Username already exists') {
                  $scope.message = 'Bummer. That username is taken. Try another?';
                }
              });
            }
          };

          $scope.forgotPasswordModal = function () {
            var modalInstance = $modal.open({
              templateUrl: "partials/password-modal.html",
              controller: ['$scope', '$modalInstance', '$http', '$cookieStore', function  ($scope, $modalInstance, $http, $cookieStore) {
                $scope.close = function() {
                  $modalInstance.close();
                }; 

                $scope.submitEmail = function (email) {
                  $http.post('/forgot', {'email': email}).then(function (res) {
                    $cookieStore.remove('pwreset');
                    $cookieStore.put('pwreset', {
                        id: res.data,
                        email: email
                      })

                  })
                  $scope.close();
                }
              }],
            });
          };
        }],
      });
    };
    $scope.launchSignUp = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/signup.html",
        controller: ['$scope', '$modalInstance', 'User', '$http', function  ($scope, $modalInstance, User) {
          $scope.close = function() {
            $modalInstance.close();
          }; 
          $scope.signin = function(user) {
            if (!User.isLoggedIn()){
              User.signin(user).
              success(function(user, status, headers, config) {
                User.getCurrentUser(user._id).success(function  (data) {
                    User.changeUser(data.user);
                    $scope.close();
                    $scope.$state.go('write');
                  }).error(function  (data) {
                  });
              }).
              error(function(err, status, headers, config) {
                if (err == 'Unknown user') {
                  $scope.message = 'No one has that username on wrdz!';
                }
                if (err == 'Invalid password') {
                  $scope.message = 'Right username, wrong password...';
                }
              });
            }
          };

          $scope.signup = function (user) {
            if (!User.isLoggedIn()) {
              User.signup(user).
              success(function(user, status, headers, config)
              {
                User.getCurrentUser(user._id).success(function  (data) {
                  User.changeUser(data.user);
                  $scope.close();

                  $scope.$state.go('write');
                }).error(function  (data) {
                  });
              }).
              error(function(err, status, headers, config)
              {
                if (err.errors.username.type === 'Username already exists') {
                  $scope.message = 'Bummer. That username is taken. Try another?';
                }
              });
            }
          };

          $scope.forgotPasswordModal = function () {
            var modalInstance = $modal.open({
              templateUrl: "partials/password-modal.html",
              controller: ['$scope', '$modalInstance', '$http', '$cookieStore', function  ($scope, $modalInstance, $http, $cookieStore) {
                $scope.close = function() {
                  $modalInstance.close();
                }; 

                $scope.submitEmail = function (email) {
                  $http.post('/forgot', {'email': email}).then(function (res) {
                    $cookieStore.remove('pwreset');
                    $cookieStore.put('pwreset', {
                        id: res.data,
                        email: email
                      })

                  })
                  $scope.close();
                }
              }],
            });
          };

        }],
      });
    };


    $scope.aboutModal = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/about-modal.html",
        controller: ['$scope', '$modalInstance', '$http', function  ($scope, $modalInstance, $http) {
          $scope.close = function() {
            $modalInstance.close();
          }; 
          

          $scope.feedbackModal = function () {
            $scope.close();
            var modalInstance = $modal.open({
              templateUrl: "partials/feedback-modal.html",
              controller: ['$scope', '$modalInstance', '$http', function  ($scope, $modalInstance, $http) {
                $scope.close = function() {
                  $modalInstance.close();
                }; 
                $scope.submitFeedback = function (feedback) {
                  console.log(feedback);
                  var data = {'content': feedback}
                  $scope.close();
                  return $http.post('/feedback', data);
                  
                };

                
              }],
            });
          };
          
        }],
      });
    };

    $scope.forgotPasswordModal = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/password-modal.html",
        controller: ['$scope', '$modalInstance', '$http', '$cookieStore', function  ($scope, $modalInstance, $http, $cookieStore) {
          $scope.close = function() {
            $modalInstance.close();
          }; 

          $scope.submitEmail = function (email) {
            $http.post('/forgot', {'email': email}).then(function (res) {
              $cookieStore.remove('pwreset');
              $cookieStore.put('pwreset', {
                  id: res.data,
                  email: email
                })

            })
            $scope.close();
          }
        }],
      });
    };

  }])
