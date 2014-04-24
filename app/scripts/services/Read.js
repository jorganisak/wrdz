'use strict';

angular.module('read')
  .factory('Read', ['$http', 'PubDoc', 'User', '$state', function ($http, PubDoc, User, $state) {

    var docList = [];



    // Public API here
    return {


      getDocs : function () {
        return docList;
      },

      setDocs : function (docs) {
        docList = docs;
      },
      
      getPubDoc : function (docId) {
        findNextDoc(docId);
        return PubDoc.findOne(docId);
      },

      followUser : function (user, bool) {
        var data = {userId: user._id, bool : bool};
        User.update('addFollowing', data);
      },


      updatePubDoc : function (docId, type, bool) {
        return PubDoc.update(docId, type, bool);
      },

    };
  }]);
