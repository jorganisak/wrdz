'use strict';

angular.module('wrdz')
  .factory('User', function ($http, $cookieStore, $rootScope) {
    // Service logic
    
    var currentUser = $cookieStore.get('user') || null;

    function changeUser(user) {
      currentUser =  user;

      $rootScope.$broadcast('userChange', user);
    }

    $cookieStore.remove('user');

    // Public API here
    return {

        changeUser: changeUser,
       
        isLoggedIn: function() {
          if(currentUser){
            return currentUser;
          } else return null;
        },
        signup: function(user) {
            return $http.post('/signup', user);
          },
        signin: function(user, success, error) {
            return $http.post('/login', user);
          },
        logout: function() {
            return $http.get('/logout');
          },
        update: function() {
          $http.post('/updateuser', currentUser).success(function(user) {
            // success(user)
          }).error();
        },
        user: currentUser,

        getCurrentUser : function(user_id) {
          return $http.get('users/'+user_id);

        },


        feedback: function(data) {
          $http.post('/feedback', data).success(function  () {
            console.log('Feedback success');
          }).error( function  () {
            console.log('Feedback error');
          });
        }
      };
  });
