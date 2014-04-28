'use strict';

/*
  Write Service
  */

angular.module('write').factory('Write', ['User', 'PubDoc', 'UserDoc', '$rootScope',
  function (User, PubDoc, UserDoc, $rootScope) {

/*
  Service Logic and declarations
  */

    var mediumEditorOptionsBody = angular.toJson(
      {"placeholder": "",
          "buttons": ["bold", "italic", "header2", "unorderedlist", "orderedlist"],
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

    function loadMoreDocs () {
      var str = "skip=" + docs.length;
      UserDoc.list(str).then(function (res) {
        var newDocs = res.data;
        if (newDocs.length != 0) {

          if (docs[docs.length-1]._id !== newDocs[newDocs.length-1]._id) {

            var set = docs.concat(res.data);
            setDocs(set);
          }
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
          $rootScope.$broadcast("focus-doc", doc._id)
        });
      }
    }

    //setting first document if no user docs
    function createFirstDoc () {
      var user = User.getUser();
      UserDoc.create().then(function (res) {
        var doc = res.data;
        doc.body = "<h4>Welcome to Wrdz</h4><p>This is your writing surface.</p><p>Write anything you want here!</p><p><span style='line-height: 1.3;'>Highlight this text to see your formatting options.</span></p><p><br></p>"
        docs.unshift(doc);
        user._userDocs.unshift(doc);
        $rootScope.$broadcast("focus-doc", doc._id)
        console.log("creating new doc")
      });
    }


    function publishDoc (isAnon, id) {
      var data = {
        id: id,
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
      loadMoreDocs: loadMoreDocs,
      getMediumOptions: mediumEditorOptionsBody,

    };
  }]);
