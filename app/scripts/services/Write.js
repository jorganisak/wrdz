'use strict';

angular.module('wrdz')
  .factory('Write', function ($http) {
    // Service logic
    // ...

    var current_doc = {};



    // Public API here
    return {


      archiveDoc : function  () {
        return $http.post('/userDocs', current_doc);
      },

      getCurrentDoc : function  () {
        return current_doc;
      },



      setCurrentDoc : function  (doc) {
        current_doc = doc;
      },

      updateCurrentDoc: function (type, content, user) {
        var data = {
          type : 'current_doc_'+type,
          doc : content
        };

        if (type == 'title') current_doc.title = content;
        if (type == 'body') current_doc.body = content;

        if (user) {
          return $http.post('/users/' + user._id, data);
        }
      }
    };
  });
