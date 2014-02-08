'use strict';

angular.module('wrdz')
  .factory('Auth', function ($http, $cookieStore, $rootScope) {
    // Service logic
    
    var currentUser = $cookieStore.get('user') || {email: ''};

    function changeUser(user) {
      _.extend(currentUser, user);

      $rootScope.$broadcast('userChange', user);
    }

    $cookieStore.remove('user');

    // Public API here
    return {
       
        isLoggedIn: function(user) {
            if(user === undefined){
              user = currentUser;
            }
            return user;
          },
        register: function(user, success, error) {
            $http.post('/signup', user).success(function(user) {
                changeUser(user);
                success(user);
              }).error(error);
          },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
              }).error(error);
          },
        logout: function(success, error) {
            $http.get('/logout').success(function(){
                changeUser({
                  email: '',
                  _id : '',
                  notes: []
                });
                success();
              }).error();
          },
        update: function() {
          $http.post('/updateuser', currentUser).success(function(user) {
            // success(user)
          }).error();
        },
        user: currentUser,


        feedback: function(data) {
          $http.post('/feedback', data).success(function  () {
            console.log('Feedback success');
          }).error( function  () {
            console.log('Feedback error');
          });
        }
      };
  });
