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
        return $http.post('/userDocs');
      },

      update: function (docId, type, data) {
        var send = {'data' : data };
        // res.status = 200 on good, 400 bad
        return $http.post('/userDocs/' + docId  + '/?type=' + type, send);
      },

      list : function (args) {
        var str = "";
        for (var i=0; i<args.length; i++) {
          str = str + '?' + args[i].type + '=' + args[i].value;
        }
        return $http.get('/userDocs/'+str);
      },

      
    };
  });
