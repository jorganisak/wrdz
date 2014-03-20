'use strict';

angular.module('read')
  .factory('Read', ['$http', 'PubDoc', 'User', function ($http, PubDoc, User) {


    var docList = [];
// list of objects with obj.type and obj.value
    var query = [];



    // Public API here
    return {

      getDocs : function () {
        return docList;
      },

      followUser : function (userId, bool) {
        var data = {userId: userId, bool : bool};
        User.update('addFollowing', data);
      },


      updatePubDoc : function (docId, type, bool) {
        return PubDoc.update(docId, type, bool);
      },

      getPubDoc : function (docId) {
        return PubDoc.findOne(docId);
      },


      // TO DELETE
      refreshDocs : function () {
        PubDoc.refresh().then(function (res) {
          docList = res.data; 
        })
      },


      
      updateQuery : function (type, value) {
        var flag = true;
        for (var i=0; i<query.length;i++) {
          if (query[i].type == type) {
            query[i].value = value;
            flag = false;
          } 
        }
        if (flag) {
          query.push({'type':type,'value':value});
        } 

        PubDoc.list(query).then( function (res) {
          docList = res.data;
        });
      }      

    };
  }]);
