'use strict';

/*
  Write Controller


    @scope VARS - 
      currentDoc {object}
          .title - tied to #write-title
          .body - tied to #write-content
      user (from MainCtrl) {object}
      newTagTitle - model for tag input {string}
      noDoc {boolean}
      noUser (this probs gets moved to MainCtrl) {boolean}
    
    ------------

    @scope watch/listeners - 
      on.userChange
      currentDoc.title
      currentDoc.body
      Write.getCurrentDoc()

    @scope methods - 
      publish
      switchDoc
      newDoc
      newTag
      removeTag

      */

angular.module('write')
  .controller('WriteCtrl', ['$scope', 'Write', '$timeout', '$window', '$modal', function ($scope, Write, $timeout, $window, $modal) {

  /*
      Utils
      */

    // TEXT EDITOR OPTIONS
    $scope.mediumEditorOptionsBody = angular.toJson(
      {"placeholder": "",
        "buttons": ["bold", "italic", "anchor", "header2", "orderedlist", "unorderedlist" ],
        "buttonLabels" : {"header2": "<b>H</b>", "anchor": "<span><span class='icon ion-link'></span></span>",
         "bold":"<strong>B</strong>", "italic": "<em>i</em>"},
        "disableToolbar": false,
        "forcePlainText" : false,
        "targetBlank": true}
    );

    $scope.mediumEditorOptionsTitle = angular.toJson(
      {"placeholder": "", "disableToolbar": true, "disableReturn": true}
    );


    /// DOM STUFF
    // Should be moved to directives for testing purposes

    function placeCaretAtEnd(el) {
      if (el) {

        el.focus();
        if (typeof $window.getSelection !== "undefined"
                && typeof document.createRange !== "undefined") {
          var range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          var sel = $window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (typeof document.body.createTextRange !== "undefined") {
          var textRange = document.body.createTextRange();
          textRange.moveToElementText(el);
          textRange.collapse(false);
          textRange.select();
        }
        $window.scrollTo(0, el.scrollHeight);
      }
    }
    // Focus content input on doc
    function focusContent() {
      placeCaretAtEnd(document.getElementById('write-content'));
    }

    function focusTitle() {
      placeCaretAtEnd(document.getElementById('write-title'))
    }

    function getSample() {
      if (document.getElementById('write-content')) {
        var sample = document.getElementById('write-content').innerText.slice(0, 1000);
        if (sample) {
          return sample;
        } else {
          return false;        
        }
      }
    }

  /*
    Init
    */

    // If user, set Write service current_doc to that users current
    if ($scope.user) {
      if ($scope.user.current_doc) {

        Write.setCurrentDoc($scope.user.current_doc);
      } else if (!$scope.user._userDocs[0]) {
        Write.createFirstDoc()
      }
    }


    // Init currentDoc if defined in Write service
    $scope.currentDoc = Write.getCurrentDoc();

  /*
    Watches
    */

    // On user change (sent from User service)
    // Sets Write service doc to current from user
    $scope.$on('userChange', function (evt, user) {
      if (user) {
        if (user._userDocs[0]) {
          Write.setCurrentDoc(user._userDocs[0]);
        } else {
          Write.createFirstDoc();
        }
      }
    });

    $scope.titleChange = function () {
      $timeout(function () {

        var val = $scope.currentDoc.title;
        if (val || val === '') {
          Write.updateUserDoc('title', val);
        }
      }, 500)

    };
    $scope.bodyChange = function () {
      $timeout(function () {
        var val = $scope.currentDoc.body;
        if (val) {
          var sample = getSample();
          if (!sample) {
            sample = $scope.currentDoc.sample;
          } else {
            $scope.currentDoc.sample = sample;
          }
          Write.updateUserDoc('body', {'sample': sample, 'body': $scope.currentDoc.body});
        }
        
      }, 500)
    };



    // Watches function result in the Write service for changes 
    // and uppdates scope accordingly
    $scope.$watch(Write.getCurrentDoc, function (newValue) {
      if (newValue) {
        $scope.noDoc = false;
        $scope.currentDoc = newValue;
        $timeout(function () {
          focusContent();
        }, 200);
      }
    });

  /*
    UX Functions
    */


    $scope.switchDoc = function (doc) {
      Write.setCurrentDoc(doc); // sets new doc on scope
    };

    $scope.newDoc = function () {
      Write.createNewDoc();
    };


    $scope.switchHasTitle = function () {
      Write.switchDocTitle($scope.currentDoc._id);
      $timeout(function () {
        focusTitle();
      },200)
    };

    $scope.archive = function (docId) {

      var bool = $scope.currentDoc.is_archived;
      $scope.currentDoc.is_archived = !bool;
      Write.updateUserDoc('archive', !bool);
      setNextDoc(docId);
    };

    function setNextDoc (docId) {
      angular.forEach($scope.user._userDocs, function (doc) {
        if (doc._id === docId) {
          var index = $scope.user._userDocs.indexOf(doc);
          var nextDoc = $scope.user._userDocs[index + 1];
          $scope.user._userDocs.splice(index, 1);
          Write.setCurrentDoc(nextDoc);
        }
      })
    }


    $scope.switchVisible = function () {
      Write.updateUserDoc('pubVisible', !$scope.currentDoc.pub_doc.is_visible);
      $scope.currentDoc.pub_doc.is_visible = !$scope.currentDoc.pub_doc.is_visible;
    };


    // MODALS 
    $scope.openPubOptionsModal = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/publish-options-modal.html",
        controller: ['$scope', 'Write', '$modalInstance', '$state', 'doc','username', function ($scope, Write, $modalInstance, $state, doc, username) {
          $scope.close = function () {
            $modalInstance.close();
          };

          $scope.doc = doc;

          $scope.username = username;

          $scope.switchVisible = function () {
            Write.updateUserDoc('pubVisible', !$scope.doc.pub_doc.is_visible);
            $scope.doc.pub_doc.is_visible = !$scope.doc.pub_doc.is_visible;
            $scope.close();
          };
  
        }],
        resolve: {

          doc : function () {
            return $scope.currentDoc;
          },

          username : function () {
            return $scope.user.username;
          }
        }
      });
    };

    $scope.openPublishModal = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/publish-modal.html",
        controller: ['$scope', 'Write', '$modalInstance', '$state', 'popularTopics', 'docTopics', 'doc', 'username', function ($scope, Write, $modalInstance, $state, popularTopics, docTopics, doc, username) {
          $scope.userTopics = popularTopics;
          $scope.docTopics = docTopics;
          $scope.username = username;
          $scope.close = function () {
            $modalInstance.close();
          };

          // Publish doc
          $scope.publish = function (isAnon) {
            Write.publishDoc(isAnon).then(
              function (res) {
                if (res.status === 201) {
                  doc.is_published = true;
                  doc.pub_doc = res.data;
                  Write.setCurrentDoc(doc);
                  // TODO prompt user to share here
                  $state.go('read.doc', {docId: res.data._id});
                  $scope.close();
                }
              }
            );
          };
        }],
        resolve: {
          popularTopics: function () {
            return $scope.user.topics;
          },

          username : function () {
            return $scope.user.username;
          },

          docTopics: function () {
            return $scope.currentDoc.topics;
          },

          doc : function () {
            return $scope.currentDoc;
          }
        }
      });
    };

        $scope.openTopicModal = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/topic-modal.html",
        controller:  ['$scope', '$modalInstance', 'userTopics', 'docTopics', 'Write', function ($scope, $modalInstance, userTopics, docTopics, Write) {
          $scope.userTopics = userTopics;
          $scope.docTopics = docTopics;
          $scope.close = function () {
            $modalInstance.close();
          };

          $scope.removeTopic = function (topic) {
            console.log(topic);
            Write.updateTopics('remove', topic.title).then(
              function () {
                $scope.docTopics.splice($scope.docTopics.indexOf(topic), 1);
              }
            );
          };

          $scope.addTopic = function (topicTitle) {
            Write.updateTopics('add', topicTitle).then(
              function (res) {
                $scope.docTopics.push(res.data);
              }
            );
          };
        }],
        resolve: {
          userTopics: function () {
            return $scope.user.topics;
          },

          currentDoc : function () {
            return $scope.currentDoc;
          },

          docTopics: function () {
            return $scope.currentDoc.topics;
          }
        }
      });
    };


  }])

  .controller('WriteLeftCtrl', ['$scope', '$modal', 'Write', function ($scope, $modal, Write) {


  /*
    Controller for Left Write Panel (new file?)
    Opens Topic and Publish Modals
    
  */

      $scope.isCollapsed = true;


    

  }]);
