'use strict';

/*
  Write Service
  */

angular.module('write').factory('Write', ['User', 'Doc', '$rootScope',
  function (User, Doc, $rootScope) {

    var mediumEditorOptionsBody = angular.toJson(
      {"placeholder": "",
          "buttons": ["bold", "italic", "unorderedlist", "orderedlist"],
          "buttonLabels" : {"header2": "<b>H</b>", "anchor": "<span><span class='icon ion-link'></span></span>",
           "bold":"<strong>b</strong>", "italic": "<em><b>i</b></em>"},
          "disableToolbar": false,
          "cleanPastedHTML": true,
          "checkLinkFormat": true,
          "targetBlank": true,
          "anchorPreviewHideDelay": 500}
      )

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
    return {

      createFirstDoc: createFirstDoc,
      getMediumOptions: mediumEditorOptionsBody,

    };
  }]);
