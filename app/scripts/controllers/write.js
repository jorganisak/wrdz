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

  .controller('WriteCtrl', function ($scope, Write, $state, $timeout, $window) {

/*
    Utils
    */

    //test if i is in array
    // returns true if not in array

    function tagArrayTest(i, a) {
      var res = true;
      angular.forEach(a, function (item) {
        if (item.title === i.title) {
          res = false;
        }
      });
      return res;
    }

    // find doc by id in user._userDocs
    function switchRecentDocTitle (id) {
      angular.forEach($scope.user._userDocs, function(doc) {
        if (doc._id === id) {
          doc.has_title = !doc.has_title;
        }
      })
    };

    function updateRecentDoc (id) {
      angular.forEach($scope.user._userDocs, function(doc) {
        if (doc._id === id) {
          doc.updated_at = Date();
        }
      })
    }


    // Focus content input on doc
    function focusContent() {
      function placeCaretAtEnd(el) {
          el.focus();
          if (typeof window.getSelection != "undefined"
                  && typeof document.createRange != "undefined") {
              var range = document.createRange();
              range.selectNodeContents(el);
              range.collapse(false);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
          } else if (typeof document.body.createTextRange != "undefined") {
              var textRange = document.body.createTextRange();
              textRange.moveToElementText(el);
              textRange.collapse(false);
              textRange.select();
          }
          $window.scrollTo(0, el.scrollHeight);
      }
      placeCaretAtEnd(document.getElementById('write-content'));
    }


/*
    Init
    */

    // Init currentDoc if defined in Write service
    $scope.currentDoc = Write.getCurrentDoc();

    // If user, set Write service current_doc to that users current
    if ($scope.user) {
      Write.setCurrentDoc($scope.user.current_doc);
    }


/*
    Watches
    */

    // On user change (sent from User service)
    // Sets Write service doc to current from user
    $scope.$on('userChange', function (evt, user) {
      if (user) {
        if (user.current_doc) {
          Write.setCurrentDoc(user.current_doc);
        } else {
          console.log('No current Doc');
          $scope.noDoc = true;
        }
      } else {
        $scope.noUser = true;
      }
    });

    // Wates doc title input for changes and updates 
    // the doc to the server through the Write service
    $scope.$watch('currentDoc.title', function (newValue, oldValue) {
      if (newValue || newValue === '') {
        Write.updateUserDoc('title', $scope.currentDoc.title);
        updateRecentDoc($scope.currentDoc._id);
      }
    });

    // Does the same for the body
    $scope.$watch('currentDoc.body', function (newValue, oldValue) {
      if (newValue) {
        var sample = getSample();
        if (!sample) sample = $scope.currentDoc.sample;
        updateRecentDoc($scope.currentDoc._id);
        Write.updateUserDoc('body', {'sample': sample, 'body': $scope.currentDoc.body});
      }
    });

    function getSample () {
      var sample = document.getElementById('write-content').innerText.slice(0, 1000);
      if (sample) {
        $scope.currentDoc.sample = sample;
        return sample;
      }
      return false;
    }

    // Watches function result in the Write service for changes 
    // and uppdates scope accordingly
    $scope.$watch(Write.getCurrentDoc, function (newValue, oldValue) {
      if (newValue) {
        $scope.currentDoc = newValue;
        // console.log(newValue)
        $scope.hasTitle = newValue.has_title;
        $timeout(function () {
          focusContent();
        }, 200)
      }
    });

/*
    UX Functions
    */


    $scope.switchDoc = function (doc) {
      Write.setCurrentDoc(doc); // sets new doc on scope
      Write.updateCurrentDoc(doc._id); // updates User.current_doc to new _id
      $scope.user.current_doc = doc; // updates the client user
    };

    $scope.newDoc = function () {
      Write.createNewDoc().then(function (res) {
        // console.log(res.status);
        var doc = res.data;
        Write.setCurrentDoc(doc); // set current doc in Write service
        Write.updateCurrentDoc (doc._id); // update User.currentDoc on server
        $scope.user._userDocs.unshift( doc );
        $scope.noDoc = false;
        focusContent();
      })
    };

    $scope.goToTop = function () {
      $window.scrollTo(0,0);
    }
    

////////////////////////////////// MESS AROUND TOWN

$scope.switchHasTitle = function () {
  Write.updateUserDoc('hasTitle', !$scope.hasTitle);
  Write.setCurrentDoc.hasTitle = !$scope.hasTitle;
  $scope.hasTitle = !$scope.hasTitle;
  switchRecentDocTitle($scope.currentDoc._id);
}

}).controller('WriteLeftCtrl', function  ($scope, $modal, Write) {
  

/*
  Controller for Left Write Panel (new file?)
  Opens Topic and Publish Modals
  
*/


  $scope.switchVisible = function () {
    Write.updateUserDoc('pubVisible', !$scope.currentDoc.pub_doc.is_visible);
    $scope.currentDoc.pub_doc.is_visible = !$scope.currentDoc.pub_doc.is_visible;

  };

  $scope.openTopicModal = function () {

    var modalInstance = $modal.open({
      templateUrl: "partials/write/topic-modal.html",
      controller: function  ($scope, $modalInstance, userTopics, docTopics, Write) {
        $scope.userTopics = userTopics;
        $scope.docTopics = docTopics;
        $scope.close = function() {
          $modalInstance.close();
        }; 

        $scope.removeTopic = function (topic) {
          console.log(topic);
          Write.updateTopics('remove', topic.title).then(
            function () {
              $scope.docTopics.splice($scope.docTopics.indexOf(topic), 1);
            })
        };

        $scope.addTopic = function (topicTitle) {
          Write.updateTopics('add', topicTitle).then(
            function () {
              $scope.docTopics.push({'title': topicTitle});
            });
        };
      },
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

  $scope.openPublishModal = function () {
    var modalInstance = $modal.open({
      templateUrl: "partials/write/publish-modal.html",
      controller: function  ($scope, Write, $modalInstance, $state, popularTopics, docTopics, doc, username) {
        $scope.userTopics = popularTopics;
        $scope.docTopics = docTopics;
        $scope.username = username;
        $scope.close = function() {
          $modalInstance.close();
        }; 

        // Publish doc
        $scope.publish = function (isAnon) {
          Write.publishDoc(isAnon).then(
            function (res) {
              if (res.status === 201) {
                console.log(res);
                doc.is_published = true;
                // TODO prompt user to share here
                $state.go('read.doc',{docId:res.data._id});
                $scope.close();
              }
            }
          );
        }
      
      },
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

});
