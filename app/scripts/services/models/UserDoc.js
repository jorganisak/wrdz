'use strict';
/*

  User Document Factory <models>



*/
angular.module('models')
  .factory('UserDoc', ['$http', function ($http) {

    // Public API here
    return {

      create : function () {
        return $http.post('/userDocs');
      },

      update: function (docId, type, data) {
        var send = {'data' : data };
        // res.status = 200 on good, 400 bad
        return $http.post('/userDocs/' + docId  + '/?type=' + type, send);
      },

      list : function (str) {

        return $http.get('/userDocs/?'+str);
      }

      
    };
  }]);
