'use strict';

/*
  Write Service
  */

  angular.module('write')
  .factory('Write', function ($http, User, PubDoc, UserDoc) {

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
      @getCurrentDoc
      @setCurrentDoc
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


    // User Docs

    createNewDoc : function  () {
      return UserDoc.create();
    },


    updateUserDoc : function  (t, d) {
      // type is either 'body' or 'title'
      var send = {'data' : d };
      

      // res.status = 200 on good, 400 bad
      return $http.post('/userDocs/' + current_doc._id  + '/?type=' + t, send)
    },



    // Published Docs

    publishDoc : function (isAnon, user) {
      var data = {
        id: current_doc._id,
        is_anon : isAnon
      }

      return PubDoc.create(data);

    },

    // User

    updateCurrentDoc: function (id) {

      User.update('currentDoc', id);

    },


/*
    Topics      
    */

    // Users

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
