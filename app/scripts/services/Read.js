'use strict';

angular.module('read')
  .factory('Read', ['$http', 'PubDoc', function ($http, PubDoc) {


    var docs = [];


    // Public API here
    return {

      getDocs : function () {
        return docs;
      },

      refreshDocs : function () {
        PubDoc.refresh().then(function (res) {
          docs = res.data; 
        })
      },

      updatePubDoc : function (docId, type, bool) {
        return PubDoc.update(docId, type, bool);
      },

      getPubDoc : function (docId) {
        return PubDoc.findOne(docId);
      },

    };
  }]);
