'use strict';

angular.module('read')  .factory('Read', ['$http', 'PubDoc', 'User', '$rootScope', 
  function ($http, PubDoc, User, $rootScope) {

    var docList = [];

    function setDocs (docs) {
      docList = docs;
    }

    // Public API here
    return {


      getDocs : function () {
        return PubDoc.list();
      },

      setDocs : setDocs,

      getUser : function (userId) {        
        return PubDoc.user(userId);
      },
      
      getPubDoc : function (docId) {
        return PubDoc.findOne(docId);
      },

      updatePubDoc : function (docId, type, bool) {
        return PubDoc.update(docId, type, bool);
      },

      loadMore : function () {
        // body...
        var str = "?skip=" + docList.length;
        PubDoc.list(str).then(function (res) {
          var newDocs = res.data;

          if (newDocs.length != 0) {

            if (docList[docList.length-1]._id !== newDocs[newDocs.length-1]._id) {

              var set = docList.concat(res.data);
              setDocs(set);
              $rootScope.$broadcast('new-read-docs', set)
            }
          }
        });
      }

    };
  }]);
