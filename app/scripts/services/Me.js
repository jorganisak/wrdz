'use strict';

/*
  Write Service
  */

  angular.module('write')
  .factory('Me', ['$http', 'User', 'UserDoc', function ($http, User, UserDoc) {



    return {
       
      testUsername : function (username) {
        return User.testUsername(username);
      },

      saveUsername : function (username) {
        return User.update('username', username)
      }

    };
}]);
