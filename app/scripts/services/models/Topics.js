'use strict';
/*

  Public Document Factory <models>



*/
angular.module('models')
  .factory('Topics', ['$http', function ($http) {
    // Service logic




    // Public API here
    return {

      update: function (docId, type, topicTitle) {
        // type : 'add', 'remove'

        var send = {
          'topic' : topicTitle,
          'docId' : docId
        };

        // res.status = 200 on good, 400 bad
        return $http.post('/topics'  + '/?type=' + type, send);
      }



    };
  }]);
