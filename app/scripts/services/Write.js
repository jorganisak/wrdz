'use strict';

/*
  Write Service
  */

  angular.module('write')
  .factory('Write', ['$http', 'User', 'PubDoc', 'UserDoc', 'Topics', function ($http, User, PubDoc, UserDoc, Topics) {

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


    updateUserDoc : function  (type, data) {

      // res.status = 200 on good, 400 bad
      return UserDoc.update(current_doc._id, type, data)
    },




    // Published Docs

    publishDoc : function (isAnon) {
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
}]);
