'use strict';

angular.module('wrdz')
  .factory('Write', function ($http) {
    // Service logic
    // ...

    var current_doc = {};

    function setCurrentDoc (doc) {
      current_doc = doc;
    };

    // Public API here
    return {

      createNewDoc : function  () {
        return $http.get('/userDocs');


      },

      getCurrentDoc : function  () {
        return current_doc;
      },



      publishDoc : function (isAnon, user) {
        var data = {
          title: current_doc.title,
          body: current_doc.body
        }
        if (isAnon) {
          data.is_anon = true;
          data.author = 'Anonymous'
          
        } else {
          data.is_anon = false;
          data.author = user.username;
        }
        return $http.post('/pubDocs', data);
      },

      setCurrentDoc : setCurrentDoc,

      updateUserDoc : function  (t, d) {
        var send = {
          type: t,
          data: d
        };
        return $http.post('/userDocs/'+current_doc._id, send);
      },

      updateCurrentDoc: function (id, user) {
        var data = {
          type : 'current_doc',
          docId : id
        };

        return $http.post('/users/' + user._id, data);
      },

      newTag : function  (tagName, docId, user)  {
        var data = {
          type: 'addTag',
          tag: {
            title: tagName,
            _docs: [docId],
            _owner: user._id
          }
        }
        return $http.post('/users/' + user._id, data)
      },

      removeTag : function  (tagId, docId, user) {
        var data = {
          type: 'removeTag',
          tag: {
            _id: tagId
          },
          doc_id : docId
        }
        console.log('removing tag');
        return $http.post('/users/' + user._id, data).then(function  (res) {
          console.log(res)
        })

      }
         
    };
  });
