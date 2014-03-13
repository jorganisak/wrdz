'use strict';

angular.module('shared')
.controller('MainCtrl', ['$scope', 'User', '$rootScope', '$modal', '$state', function ($scope, User, $rootScope, $modal, $state) {

/*
Does a few things:
  1. when loaded checks to see if user is logged in
  2. if it is a cookie of a user then it calls to get full user
  3. assigns the full user to $scope.user
  4. listener at the bottom for changes like login/signup/logout

  */


  function getUser () {
    var u = User.isLoggedIn();
      // gets full user, messages check is to make sure the user is not already complete
      if (u && !u.messages) {
        User.getCurrentUser(u._id).success(function  (data) {
          User.changeUser(data.user);
        }).error(function  (data) {
          console.log(data);
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

/*
  Two Auth methods for launching Login and Signup modals from anyhere in the app
  They launch modals and call the User service for commnication with server
*/
    $scope.launchLogIn = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/signin.html",
        controller: ['$scope', '$modalInstance', 'User', function  ($scope, $modalInstance, User) {
          $scope.close = function() {
            $modalInstance.close();
          }; 
          $scope.signin = function(user) {
            if (!User.isLoggedIn()){
              User.signin(user).
              success(function(user, status, headers, config) {
                User.changeUser(user);
                $scope.close();
                $state.go('write');
              }).
              error(function(err, status, headers, config) {
                if (err == 'Unknown user') {
                  $scope.message = 'No one has that username on wrdz!';
                }
                if (err == 'Invalid password') {
                  $scope.message = 'Right username, wrong password, need link to change password here';
                }
              });
            }
          };
        }],
      });
    };
    $scope.launchSignUp = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/signup.html",
        controller: ['$scope', '$modalInstance', 'User', '$http', function  ($scope, $modalInstance, User, $http) {
          $scope.close = function() {
            $modalInstance.close();
          }; 
          $scope.signup = function (user) {
            if (!User.isLoggedIn()) {
              User.signup(user).
              success(function(user, status, headers, config)
              {
                User.changeUser(user);
                $state.go('write');
              }).
              error(function(err, status, headers, config)
              {
                console.log(err.errors.email.type);
                $scope.message = 'Something went wrong...someone probably already has that email on here.';
              });
            }
          };

          $scope.twitter = function () {
            $http.get('/auth/twitter');
          }
        }],
      });
    };
    $scope.feedbackModal = function () {
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
  }])


.controller('MenuShortcutCtrl', ['$scope', function($scope) {
    $scope.items = [
    {'title':"write", 'state':"write"},
    {'title':"read", 'state':"read.list.front"},
    {'title':"my wrdz", 'state':"mywrdz"},
    {'title':"me", 'state':"me"},

    ];
}]);
