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
      User.setUser(user);
    }

    function getCurrentDoc() {
      return current_doc;
    }

    function updateCurrentDoc (id) {
      User.update('currentDoc', id);
    }
    
    function updateUserDoc (type, data) {
      return UserDoc.update(current_doc._id, type, data);
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

      createNewDoc : function () {
        return UserDoc.create();
      },

      updateUserDoc : updateUserDoc,



      // Published Docs

      publishDoc : function (isAnon) {
        var data = {
          id: current_doc._id,
          is_anon : isAnon
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
