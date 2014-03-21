'use strict';

angular.module('read')
  .factory('Read', ['$http', 'PubDoc', 'User', 'Topics', function ($http, PubDoc, User, Topics) {


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

      //TOP TOPICS

      refreshTopics : function () {
        return Topics.getTop()
      },



      updateQuery : function (newQuery) {
        for (var j=0; j < newQuery.length; j++) {

          var flag = true;

          for (var i=0; i<query.length;i++) {
            if (query[i].type == newQuery[j].type) {
              query[i].value = newQuery[j].value;
              flag = false;
            } 
          }
          if (flag) {
            query.push({'type': newQuery[j].type,'value': newQuery[j].value});
          } 
        }


        return PubDoc.list(query);
      }      

    };
  }]);
