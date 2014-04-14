'use strict';

/*
  Write Service
  */

angular.module('write')
  .factory('Write', ['User', 'PubDoc', 'UserDoc', 'Topics', function (User, PubDoc, UserDoc, Topics) {

/*
  Service Logic and declarations
  */
    
    //Internal
    var firstDoc = {
        body: "<p><span style='font-weight: 800;'>Ahoy internet traveler!</span></p><p>Try something for me - highlight this text.</p><p>You see that? It is <b><i>editable!</i>&nbsp;</b>&nbsp;This is a writing surface!</p><p><br></p><p>If you sign up for Wrdz, you can save and share as many of these as your heart desires.</p><p><br></p><p><i>p.s.</i></p><p>If you sign in with Twitter, you can share your writing as a <i>picture attached to a tweet</i>. &nbsp;Your followers will read it straight from the feed, without needing to click a link!</p>",
        created_at: Date(),
        has_title: true,
        is_archived: false,
        is_published: false,
        sample: "Ahoy internet traveler!↵↵↵↵Try something for me - highlight this text.↵↵You see that? It is editable!  This is a writing surface!↵↵↵↵If you sign up for Wrdz, you can save and share as many of these as your heart desires.↵↵↵↵p.s.↵↵If you sign in with Twitter, you can share your writing as a picture attached to a tweet.  Your followers will read it straight from the feed, without needing to click a link!↵↵",
        title: "Welcome to Wrdz",
        topics: Array[0],
        updated_at: Date()
    }

    var blankDoc = {
        body: "",
        created_at: Date(),
        has_title: false,
        is_archived: false,
        is_published: false,
        sample: "",
        title: "",
        topics: Array[0],
        updated_at: Date()
    };

    var current_doc = {};

    var docs = [];

    function getCurrentDoc() {
      return current_doc;
    }

    function getDocs () {
      return docs;
    }

    function setDocs (newDocs) {

      docs = newDocs;
    }

    //User


    function updateCurrentDoc (id) {
      User.update('currentDoc', id);
    }

    function setCurrentDoc(doc) {
      if (doc) {
        current_doc = doc;
        if (doc._id) updateCurrentDoc(doc._id);
        var user = User.getUser();
        if (user) user.current_doc = doc;
      } else {
        current_doc = {};
      }
    }

    //UserDoc
    
    function updateUserDoc (type, data) {
      updateRecentDoc(current_doc._id);
      return UserDoc.update(current_doc._id, type, data);
    }

    function createNewDoc () {
      var user = User.getUser();
      if (user) {
        UserDoc.create().then(function (res) {
          var doc = res.data;
          //add to userdocs on scope user
          user._userDocs.unshift(doc);
          //set the current doc to the new doc
          setCurrentDoc(doc);
          console.log(doc);
        });
      }
      else {
        docs.unshift(blankDoc);
        setCurrentDoc(blankDoc);
      }
    }

    //setting first document if no user docs
    function createFirstDoc () {
      var user = User.getUser();
      UserDoc.create().then(function (res) {
        var doc = res.data;
        doc.title = 'My First Wrdz';
        doc.body = '<p>Delete this and write something awesome!</p>'
        user._userDocs.unshift(doc);
        setCurrentDoc(doc);
        updateUserDoc('title', 'My First Wrdz');
        switchDocTitle(doc._id);
        current_doc.has_title = true;
      });
    }

    function updateRecentDoc(id) {
      angular.forEach(User.getUser()._userDocs, function (doc) {
        if (doc._id === id) {
          doc.updated_at = Date();
        }
      });
    }

    function switchDocTitle (id) {
      //update userdoc
      if (User.getUser()) {
        updateUserDoc('hasTitle', !current_doc.has_title);
      }
      //udate current doc
      current_doc.has_title = !current_doc.has_title;
      //update userDocs on scope.user
      angular.forEach(docs, function (doc) {
        if (doc._id === id) {
          doc.has_title = !doc.has_title;
        }
      });
    };

    function publishDoc (isAnon) {

        var data = {
          id: current_doc._id,
          is_anon : isAnon,
        };

        return PubDoc.create(data);

    };

    function updateTopics (type, topicTitle) {
      return Topics.update(current_doc._id, type, topicTitle);
    }
/*
    Public API here  
*/

    return {

      getFirstDoc : function () {
        return firstDoc;
      },

      createFirstDoc: createFirstDoc,
      getCurrentDoc : getCurrentDoc,
      setCurrentDoc : setCurrentDoc,
      switchDocTitle: switchDocTitle,
      createNewDoc : createNewDoc,
      updateUserDoc : updateUserDoc,
      publishDoc : publishDoc,
      updateCurrentDoc: updateCurrentDoc,
      updateTopics : updateTopics,
      getDocs: getDocs,
      setDocs: setDocs,

    };
  }]);
