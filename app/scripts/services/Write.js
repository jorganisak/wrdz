'use strict';

/*
  Write Service
  */

angular.module('write')
  .factory('Write', ['User', 'PubDoc', 'UserDoc', function (User, PubDoc, UserDoc) {

/*
  Service Logic and declarations
  */
    
    //Internal
    var firstDoc = {
        body: "<p><span style='font-weight: 800;'>Ahoy internet traveler!</span></p><p>Try something for me - highlight this text.</p><p>You see that? It is <b><i>editable!</i>&nbsp;</b>&nbsp;This is a writing surface!</p><p><br></p><p>If you sign up for Wrdz, you can save and share as many of these as your heart desires.</p><p><br></p><p><i>p.s.</i></p><p>If you sign in with Twitter, you can share your writing as a <i>picture attached to a tweet</i>. &nbsp;Your followers will read it straight from the feed, without needing to click a link!</p>",
        created_at: Date(),
        is_archived: false,
        is_published: false,
        updated_at: Date()
    }

    var blankDoc = {
        body: "",
        created_at: Date(),
        is_archived: false,
        is_published: false,
        updated_at: Date()
    };

    var docs = [];

    function getDocs () {
      return docs;
    }

    function setDocs (newDocs) {
      docs = newDocs;
    }

    //UserDoc
    
    function updateUserDoc (type, data) {
      //this argument will need to take an id as argument
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
          console.log(doc);
        });
      }
      else {
        docs.unshift(blankDoc);
      }
    }

    //setting first document if no user docs
    function createFirstDoc () {
      var user = User.getUser();
      UserDoc.create().then(function (res) {
        var doc = res.data;
        doc.body = '<p>Delete this and write something awesome!</p>'
        user._userDocs.unshift(doc);
      });
    }

    function updateRecentDoc(id) {
      angular.forEach(User.getUser()._userDocs, function (doc) {
        if (doc._id === id) {
          doc.updated_at = Date();
        }
      });
    }

    function publishDoc (isAnon) {
      var data = {
        id: current_doc._id,
        is_anon : isAnon,
      };
      return PubDoc.create(data);
    };

/*
    Public API here  
*/

    return {

      getFirstDoc : function () {
        return firstDoc;
      },

      createFirstDoc: createFirstDoc,
      createNewDoc : createNewDoc,
      updateUserDoc : updateUserDoc,
      publishDoc : publishDoc,
      getDocs: getDocs,
      setDocs: setDocs,

    };
  }]);
