'use strict';

angular.module('wrdz')
  .factory('Write', function ($http) {
    // Service logic
    // ...

    var current_doc = {};

    function setCurrentDoc (doc) {
      current_doc = doc;
    };

    // Public API here
    return {

      createNewDoc : function  () {
        return $http.get('/userDocs');


      },




      getCurrentDoc : function  () {
        return current_doc;
      },

      publishDoc : function () {
        return $http.post('/pubDocs', current_doc);
      },

      setCurrentDoc : setCurrentDoc,

      updateUserDoc : function  (t, d) {
        var send = {
          type: t,
          data: d
        };
        return $http.post('/userDocs/'+current_doc._id, send);
      },

      updateCurrentDoc: function (id, user) {
        var data = {
          type : 'current_doc',
          docId : id
        };

        return $http.post('/users/' + user._id, data);

        
        
      }
    };
  });
