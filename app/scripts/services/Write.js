'use strict';

/*
  Write Service
  */

angular.module('write')
  .factory('Write', ['User', 'PubDoc', 'UserDoc', 'Topics', function (User, PubDoc, UserDoc, Topics) {

/*
  Service Logic and declarations
  */
  

    var current_doc = {};

    function setCurrentDoc(doc) {
      current_doc = doc;
      updateCurrentDoc(doc._id);
      var user = User.getUser();
      user.current_doc = doc;
    }

    function getCurrentDoc() {
      return current_doc;
    }

    function updateCurrentDoc (id) {
      User.update('currentDoc', id);
    }
    
    function updateUserDoc (type, data) {
      updateRecentDoc(current_doc._id);
      return UserDoc.update(current_doc._id, type, data);
    }

    function createNewDoc () {
      var user = User.getUser();
      UserDoc.create().then(function (res) {
        var doc = res.data;
        user._userDocs.unshift(doc);
        setCurrentDoc(doc);
      });
    }

    function updateRecentDoc(id) {
      angular.forEach(User.getUser()._userDocs, function (doc) {
        if (doc._id === id) {
          doc.updated_at = Date();
        }
      });
    }

/*
    Public API here  

      */

    return {


      getCurrentDoc : getCurrentDoc,
      setCurrentDoc : setCurrentDoc,

            // find doc by id in user._userDocs
      switchDocTitle: function (id) {
        updateUserDoc('hasTitle', !current_doc.has_title);
        current_doc.has_title = !current_doc.has_title;


        angular.forEach(User.getUser._userDocs, function (doc) {
          if (doc._id === id) {
            doc.has_title = !doc.has_title;
          }
        });
      },

      /*
      Docs API
      */


      // User Docs

      createNewDoc : createNewDoc,

      updateUserDoc : updateUserDoc,



      // Published Docs

      publishDoc : function (isAnon) {

        var topics = [];
        angular.forEach(current_doc.topics, function (topic) {
          console.log(topic);
          topics.push(topic._id);
        });
        var data = {
          id: current_doc._id,
          is_anon : isAnon,
          topics: topics
        };
        return PubDoc.create(data);

      },


      // User

      updateCurrentDoc: updateCurrentDoc,


      // Topics

      updateTopics : function (type, topicTitle) {
        return Topics.update(current_doc._id, type, topicTitle);
      }

    };
  }]);
