'use strict';
/*

  Public Document Factory <models>



*/
angular.module('models')
  .factory('PubDoc', function ($http) {
    // Service logic




    // Public API here
    return {

      create : function () {
        return $http.get('/pubDocs');
      },

      update: function (docId, type, bool) {
        var send = {'data' : bool };

        // res.status = 200 on good, 400 bad
        return $http.post('/pubDocs/' + docId  + '/?type=' + type, send);
      }



    };
  });
