'use strict';

angular.module('wrdz')
  .controller('AuthCtrl', function ($scope, Auth, Notes, $timeout, $rootScope) {
    

    function testShowForms() {
        if (!$scope.user) {
          return true;
        } else {
          return false;
        }
      }

    $scope.showForms = testShowForms();
    $scope.showFeedback = false;
    $scope.showLogin = false;
    $scope.secondButton = 'Log In';

    $scope.switchForm = function  () {
      $scope.showLogin = !$scope.showLogin;
      if ($scope.secondButton === 'Log In') {
        $scope.secondButton = 'Sign Up';
      } else {
        $scope.secondButton = 'Log In';
      }
    };


    $scope.sendFeedback = function  (content) {
      var data = {
        userEmail : Auth.user.email,
        content : content,
        created  : new Date()
      };

      Auth.feedback(data);
      $scope.showFeedback = false;

      $scope.showThanks = true;

      $timeout(function  () {
        $scope.showThanks = false;
      }, 3000);
    };

    $scope.signUp = function(user) {

      if ($scope.signUpForm.$valid) {

        var data = {
            email : user.email,
            password : user.password
          };

        Auth.register(data,
            function(user) {
      
                console.log('Register Success!: '+user);
                $scope.showForms = false;
                //goes to notes ctrl
                $scope.user = user;
                $rootScope.$broadcast('register');
              },
            function() {
                console.log('Register Error :( ');
              });
        };
      };

    $scope.signOut = function() {
        Auth.logout(function() {
          Notes.initNoUser();
        });
        $scope.showForms = true;
        $scope.user = null;
      };

    $scope.signIn = function(user) {
      if ($scope.signInForm.$valid) {

        var data = {
          email : user.email,
          password : user.password
        };


        Auth.login(data,
          function(user) {
            console.log('Login Sucess!');
            $scope.showForms = false;
            //goes to notes ctrl
            $scope.user = user;
            $rootScope.$broadcast('logIn');
          },
          function() {
            console.log('Error logging in');
          });
        
      }
    };

       


  });
