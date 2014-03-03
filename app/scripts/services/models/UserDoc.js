'use strict';
/*

  User Document Factory <models>



*/
angular.module('models')
  .factory('UserDoc', function ($http) {
    // Service logic




    // Public API here
    return {

      create : function () {
        return $http.get('/userDocs');
      },

      update: function (docId, type, data) {
        

        var send = {'data' : data };

        // res.status = 200 on good, 400 bad
        return $http.post('/userDocs/' + docId  + '/?type=' + type, send);
      }



    };
  });
