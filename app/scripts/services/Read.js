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
          docs = data;
        }).error();
      }



    };
  });
