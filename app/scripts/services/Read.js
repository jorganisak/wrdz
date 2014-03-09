'use strict';

angular.module('read')
  .factory('Read', function ($http, PubDoc) {


    var docs = [];


    // Public API here
    return {

      getDocs : function  () {
        return docs;
      },

      refreshDocs : function  () {
        $http.get('pubDocs/').success(function  (data) {
          // console.log(data);
          docs = data;


        }).error();
      },

      updatePubDoc : function  (docId, type) {
        var data = {
          type: type
        }
        return $http.post('/pubDocs/'+ docId, data);
      },


      getPubDoc : function  (docId) {
        return PubDoc.findOne(docId);
      },

    };
  });
