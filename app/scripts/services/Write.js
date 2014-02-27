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
      return $http.get('/userDocs');
    },


    updateUserDoc : function  (t, d) {
      // type is either 'body' or 'title'
      var send = {'data' : d };
      
      return $http.post('/userDocs/' + current_doc._id  + '/?type=' + t, send);
    },


    // updateHasTitle : function  (hasTitle) {
    //   var data = {
    //     data: hasTitle
    //   }
    //   return $http.post('/userDocs/' + current_doc._id + '/?type=hasTitle', data);
    // },


    // Published Docs

    publishDoc : function (isAnon, user) {
      var data = {
        doc : {
          title: current_doc.title,
          body: current_doc.body,
          
        },
        id: current_doc._id
      }

      if (isAnon) {
        data.doc.is_anon = true;
        data.doc.author = 'Anonymous'

      } else {
        data.doc.is_anon = false;
        data.doc.author = user.username;
      }

      return $http.post('/pubDocs', data);
    },

    // User

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
