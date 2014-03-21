'use strict';
/*

  User Factory <models>



*/
angular.module('models')
  .factory('User', ['$http', '$cookieStore', '$rootScope', function ($http, $cookieStore, $rootScope) {
    // Service logic


    function changeUser(user) {

      currentUser =  user;
      $rootScope.$broadcast('userChange', user);
    }


    var currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    // Public API here
    return {

      changeUser: changeUser,

      isLoggedIn: function () {
        if (currentUser) {
          return true;
        } else {
          return false;
        }
      },

      getUser: function (argument) {
        if (currentUser) {
          return currentUser;
        }      
      },

      // Same as change user but no broadcast to rest of app
      setUser: function (user) {
        if (user) {
          currentUser = user;
        }
      },



/*
  SERVER CALLS 
*/

      update: function (t, d) {
        var send = {'data' : d };
        // res.status = 200 on good, 400 bad
        return $http.post('/users/' + currentUser._id  + '/?type=' + t, send);
      },

      getCurrentUser : function (user_id) {
        return $http.get('users/' + user_id);
      },
      
      resetPassword : function (email, password) {
        // body...
        var res = {
          email : email,
          password : password
        }
        return $http.post('/reset', res);
      },

      // Auth

      signup: function (user) {
        return $http.post('/signup', user);
      },

      signin: function (user) {
        return $http.post('/login', user);
      },

      logout: function () {
        return $http.get('/logout');
      },


    };
  }]);
