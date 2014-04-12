'use strict';

/*
  Write Controller


    @scope VARS - 
      currentDoc {object}
          .title - tied to #write-title
          .body - tied to #write-content
      user (from MainCtrl) {object}
      newTagTitle - model for tag input {string}
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
  .controller('WriteCtrl', ['$scope', 'Write', '$timeout', '$window', '$modal', 'Picture',
    function ($scope, Write, $timeout, $window, $modal, Picture) {

  /*
      Utils
      */

    // TEXT EDITOR OPTIONS
    $scope.mediumEditorOptionsBody = angular.toJson(
      {"placeholder": "Write here",
        "buttons": ["bold", "italic", "anchor", "header2", "orderedlist", "unorderedlist" ],
        "buttonLabels" : {"header2": "<b>H</b>", "anchor": "<span><span class='icon ion-link'></span></span>",
         "bold":"<strong>b</strong>", "italic": "<em>i</em>"},
        "disableToolbar": false,
        "forcePlainText" : false,
        "targetBlank": true}
    );

    $scope.mediumEditorOptionsTitle = angular.toJson(
      {"placeholder": "Title", "disableToolbar": true, "disableReturn": true}
    );



    $scope.isCollapsed = true;


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
        Write.setDocs($scope.user._userDocs);

      } else if (!$scope.user._userDocs[0]) {
        Write.createFirstDoc()
        
      }
    }
    else {
      Write.setCurrentDoc(Write.getFirstDoc());
      Write.setDocs([Write.getFirstDoc()]);
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
        Write.setDocs($scope.user._userDocs);
        if ($scope.user._userDocs[0]) {
          Write.setCurrentDoc($scope.user._userDocs[0]);
        } else {
          Write.createFirstDoc();
        }
      }
    });

    $scope.titleChange = function () {
      $timeout(function () {

        var val = $scope.currentDoc.title;
        if (val || val === '') {
          if ($scope.user) {
            Write.updateUserDoc('title', val);
            
          }
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
          if ($scope.user) {

            Write.updateUserDoc('body', {'sample': sample, 'body': $scope.currentDoc.body});
          }
        }
        
      }, 500)
    };

    // Watches function result in the Write service for changes 
    // and uppdates scope accordingly
    $scope.$watch(Write.getCurrentDoc, function (newValue) {
      if (newValue) {
        $scope.currentDoc = newValue;
        //does not scroll if user is not authed
        if (newValue.title !== "Welcome to Wrdz") {

          $timeout(function () {
            focusContent();
          }, 200);
        }
      }
    });

    $scope.$watchCollection(Write.getDocs, function (newValue) {
      if (newValue) {
        $scope.docs = newValue;
      }
    });

  /*
    UX Functions
    */

    // $scope.showRecent = false;
    $scope.hideRecent = function () {

        $timeout(function () {

            $scope.showRecent = false;
        }, 500)
            if ($scope.showLeft === true) {

        $timeout(function () {
          if ($scope.showLeft === true) {

            $scope.showLeft = false;
          }
        }, 500)
      }

    };



    $scope.switchDoc = function (doc) {
      Write.setCurrentDoc(doc); // sets new doc on scope
    };

    $scope.newDoc = function () {
      Write.createNewDoc();
    };


    $scope.switchHasTitle = function () {
      Write.switchDocTitle($scope.currentDoc._id);
      $scope.currentDoc.has_title = !$scope.currentDoc.has_title;
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


    /*
      MODALS 
    */



    $scope.openPublishModal = function () {
      if (!$scope.currentDoc.is_published) {
        
        var modalInstance = $modal.open({
          templateUrl: "partials/publish-modal.html",
          controller: ['$scope', 'Write', '$modalInstance', '$state', 'doc', 'user', 'Picture',
          function ($scope, Write, $modalInstance, $state, doc, user, Picture) {
            $scope.user = user;
            $scope.anon = false;
            $scope.twitterShareCollapsed = false;
            var img = "";

            if (user) {
              $scope.username = user.username;
            }

            $scope.close = function () {
              $modalInstance.close();
            };


            // Publish doc
            $scope.publish = function (isAnon, tweet) {

              Write.publishDoc(isAnon).then(
                function (res) {
                  if (res.status === 201) {
                    if (tweet) {
                      Picture.tweetPic(user, img, res.data._id);
                    }
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

            html2canvas(document.getElementById('write-center'), 
            {
              onrendered : function (canvas) {
                document.getElementById('twitter-share').appendChild(canvas);

                img = canvas.toDataURL("image/png");
                console.log(img);

                // if (canvas.toBlob) {
                //   canvas.toBlob(
                //       function (blob) {
                //         console.log(blob)
                //           // Do something with the blob object,
                //           // e.g. creating a multipart form for file uploads:
                //          img = blob;

                //       },
                //       'image/png'
                //   );
                // }
              }
            })


          }],
          resolve: {


            user : function () {
                return $scope.user;
            
            },

            doc : function () {
              return $scope.currentDoc;
            }
          }
        });
      }
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

