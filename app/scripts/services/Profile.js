'use strict';

angular.module('wrdz')
  .factory('Profile', function ($http) {
    // Service logic
    // ...

    var docIds = [];

    var docs = [];

    // Public API here
    return {

      getDocIds: function () {
        return docIds;
      },
      setDocIds: function (a) {
        docIds = a;
      },
      pushDocId: function  (id) {
        docIds.push(id);
      },

      getDocs: function  () {
        return docs;
      },
      setDocs: function  (a) {
         docs = a;
      },

      getDocServer_20 : function() {
        var ids = docIds.slice(-20);
        angular.forEach(ids, function  (id) {
          $http.get('userDocs/' + id).success(function  (data) {
            docs.push(data);
          });
        });
      }
      

    };
  });
