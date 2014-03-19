'use strict';

angular.module('read')
  .factory('Read', ['$http', 'PubDoc', 'User', function ($http, PubDoc, User) {


    var docs = [];


    // Public API here
    return {

      getDocs : function () {
        return docs;
      },

      followUser : function (userId, bool) {
        var data = {userId: userId, bool : bool};
        User.update('addFollowing', data);
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
