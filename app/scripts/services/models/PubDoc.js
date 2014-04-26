'use strict';
/*

  Public Document Factory <models>



*/
angular.module('models')
  .factory('PubDoc', ['$http', function ($http) {
    // Service logic




    // Public API here
    return {

      create : function (data) {
        return $http.post('/pubDocs', data);
      },

      update: function (docId, type, bool) {
        var send = {'data' : bool };

        // res.status = 200 on good, 400 bad
        return $http.post('/pubDocs/' + docId  + '/?type=' + type, send);
      },

      findOne : function (docId) {
        return $http.get('/pubDocs/' + docId);
      },


      ///TO DELETE
      refresh : function () {
        return $http.get('pubDocs/');
      },

      getHearts : function (docIds) {
        var data = {docIds: docIds}
        return $http.post('pubDocs/hearts', data)
      },

      list : function () {

        return $http.get('/pubDocs');
      }
    }
  }]);
