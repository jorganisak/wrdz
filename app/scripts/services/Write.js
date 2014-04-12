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
        body: "<p><b>1. Highlight this text.</b></p><p>2. You see? Its <i>editable</i>. &nbsp;This is a writing surface!</p><p>3. Delete this text (but not before you read all the steps!) and change the title, and write something awesome.</p><p><i>then</i></p><p>5. Sign in with Twitter (link) to share your writing as a picture (if over 200 words, then a link). (sign in at any points)</p><p>6. <b style='font-style: italic;'>Or don't share!</b>&nbsp; No pressure dude.&nbsp;Just sign in with Twitter <i>or email</i>&nbsp;and you'll be able to save your writing prvately.</p>",
        created_at: Date(),
        has_title: true,
        is_archived: false,
        is_published: false,
        sample: "1. Highlight this text.↵↵2. You see? Its editable.  This is a writing surface!↵↵3. Delete this text (but not before you read all the steps!) and change the title, and write something awesome.↵↵then↵↵5. Sign in with Twitter (link) to share your writing as a picture (if over 200 words, then a link). (sign in at any points)↵↵6. Or don't share!  No pressure dude. Just sign in with Twitter or email and you'll be able to save your writing prvately.↵↵",
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
        user._userDocs.unshift(doc);
        setCurrentDoc(doc);
        updateUserDoc('title', 'My First Wrdz');
        switchDocTitle(doc._id);
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
        angular.forEach(User.getUser()._userDocs, function (doc) {
          if (doc._id === id) {
            doc.has_title = !doc.has_title;
          }
        });
      }
      //udate current doc
      current_doc.has_title = !current_doc.has_title;
      //update userDocs on scope.user
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
