'use strict';

/*
  Write Service
  */

  angular.module('wrdz')
  .factory('Write', function ($http) {

/*
      Service Logic and declarations
      */

      var current_doc = {};

      function setCurrentDoc (doc) {
        current_doc = doc;
      };

      function getCurrentDoc () {
        return current_doc;
      };


/*
    Public API here  

    Doc: 
      @createNewDoc
      @publishDoc
      @updateUserDoc
      @updateCurrentDoc

    Tags:
      @newTag
      @removeTag

      */

      return {
        getCurrentDoc : getCurrentDoc,
        setCurrentDoc : setCurrentDoc,

/*
    Docs API
    */
    createNewDoc : function  () {
      return $http.get('/userDocs');
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


    updateUserDoc : function  (t, d) {
      // type t is either 'body' or 'title'
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


/*
    Tags      
    */


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
      // console.log('removing tag');
      return $http.post('/users/' + user._id, data).then(function  (res) {
        console.log(res)
      })

    }




  };
});
