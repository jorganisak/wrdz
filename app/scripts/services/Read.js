'use strict';

angular.module('wrdz')
  .factory('Read', function ($http) {


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

      getPubDoc : function  (docId) {
        return $http.get('pubDocs/'+ docId);
      },

      updatePubDoc : function  (docId, type) {
        var data = {
          type: type
        }
        return $http.post('/pubDocs/'+ docId, data);
      }



    };
  });
