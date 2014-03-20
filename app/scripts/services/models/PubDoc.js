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

      list : function (args) {
        var str = "";
        for (var i=0; i<args.length; i++) {
          if (args[i].value instanceof Array) {
            for (var j=0; j< args[i].value.length; j++) {
              str = str + args[i].type + '[]=' + args[i].value[j] + '&';
            }
          } else {

            str = str  + args[i].type + '=' + args[i].value + '&';
          }
        }
        return $http.get('/pubDocs/?'+str);
      }
    }
  }]);
