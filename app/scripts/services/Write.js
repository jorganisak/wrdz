'use strict';

/*
  Write Service
  */

  angular.module('write')
  .factory('Write', function ($http, User, PubDoc, UserDoc, Topics) {

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

    Topics:
      @updateTopic
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

    // Topics

    updateTopics : function (type, topicTitle) {
      return Topics.update(current_doc._id, type, topicTitle);
    }
  };
});
