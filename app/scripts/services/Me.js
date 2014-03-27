'use strict';

/*
  Write Service
  */

  angular.module('write')
  .factory('Me', ['$http', 'User', 'UserDoc','PubDoc', function ($http, User, UserDoc, PubDoc) {



    return {
       
      testUsername : function (username) {
        return User.testUsername(username);
      },

      saveUsername : function (username) {
        return User.update('username', username)
      },

      getHearts : function () {

        var res =  User.getUser();
        if(!res.meta) {
          return false;
        }
     

        var hearts = res.meta._hearts;
        var i = PubDoc.getHearts(hearts);
        return i;

        
      },

    };
}]);
