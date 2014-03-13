'use strict';
/*

  User Factory <models>



*/
angular.module('models')
  .factory('User', ['$http', '$cookieStore', '$rootScope', function ($http, $cookieStore, $rootScope) {
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

      isLoggedIn: function () {
        if (currentUser) {
          return currentUser;
        }
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

      update: function (t, d) {

        var send = {'data' : d };

        // res.status = 200 on good, 400 bad
        return $http.post('/users/' + currentUser._id  + '/?type=' + t, send);

      },

      user: currentUser,

      getCurrentUser : function (user_id) {
        return $http.get('users/' + user_id);

      },



    };
  }]);
