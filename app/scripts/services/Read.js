'use strict';

angular.module('read')
  .factory('Read', ['$http', 'PubDoc', 'User', '$state', function ($http, PubDoc, User, $state) {

    var docList = [];



    // Public API here
    return {


      getDocs : function () {

        return PubDoc.list();
      },

      setDocs : function (docs) {
        docList = docs;
      },
      
      getPubDoc : function (docId) {
        return PubDoc.findOne(docId);
      },

      updatePubDoc : function (docId, type, bool) {
        return PubDoc.update(docId, type, bool);
      },

    };
  }]);
