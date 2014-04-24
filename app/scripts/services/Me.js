'use strict';


  angular.module('shared')
  .factory('Me', ['$http', 'User', function ($http, User) {

    return {
       
      testUsername : function (username) {
        return User.testUsername(username);
      },

      saveUsername : function (username) {
        return User.update('username', username)
      },

    };
}]);
