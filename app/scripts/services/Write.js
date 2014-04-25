'use strict';

/*
  Write Service
  */

angular.module('write')
  .factory('Write', ['User', 'PubDoc', 'UserDoc', function (User, PubDoc, UserDoc) {

/*
  Service Logic and declarations
  */

    var mediumEditorOptionsBody = angular.toJson(
      {"placeholder": "Write here",
          "buttons": ["bold", "italic", "header2"],
          "buttonLabels" : {"header2": "<b>H</b>", "anchor": "<span><span class='icon ion-link'></span></span>",
           "bold":"<strong>b</strong>", "italic": "<em><b>i</b></em>"},
          "disableToolbar": false,
          "cleanPastedHTML": true,
          "checkLinkFormat": true,
          "targetBlank": true,
          "anchorPreviewHideDelay": 500}
      )

    var docs = [];

    function getDocs () {
      return docs;
    }

    function setDocs (newDocs) {
      docs = newDocs;
    }
    
    function updateUserDoc (type, data, id) {
      updateRecentDoc(id);
      return UserDoc.update(id, type, data);
    }
    // should test to see if this is needed
    function updateRecentDoc(id) {
      angular.forEach(User.getUser()._userDocs, function (doc) {
        if (doc._id === id) {
          doc.updated_at = Date();
        }
      });
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

      createFirstDoc: createFirstDoc,
      createNewDoc : createNewDoc,
      updateUserDoc : updateUserDoc,
      publishDoc : publishDoc,
      getDocs: getDocs,
      setDocs: setDocs,
      getMediumOptions: mediumEditorOptionsBody,

    };
  }]);
