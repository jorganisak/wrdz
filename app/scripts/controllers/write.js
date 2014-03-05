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

  .controller('WriteCtrl', function ($scope, User, Write, $state, $timeout) {

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

    // Focus content input on doc
    function focusContent() {
      document.getElementById('write-content').focus();
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
      }
    });

    // Does the same for the body
    $scope.$watch('currentDoc.body', function (newValue, oldValue) {
      if (newValue) {
        Write.updateUserDoc('body', $scope.currentDoc.body);
      }
    });

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

    // Not using this at the moment but... 

            // $scope.archive = function () {
            //   if ($scope.currentDoc.title && $scope.currentDoc.body) {
            //     Write.archiveDoc().then(
            //       function (data) {
            //         Profile.pushDocId(data.data._id);
            //         Write.updateCurrentDoc('body', '', User.user);
            //         Write.updateCurrentDoc('title', '', User.user);          
            //       });
            //   } else {
            //     // { TODO } error message notifiying user
            //     console.log('note is empty!!');
            //   }
            // };

    // Publish doc

    $scope.publish = function (isAnon) {
      Write.publishDoc(isAnon, $scope.user).then(
        function (res) {
          if (res.status === 201) {
            // console.log(res);
            $scope.currentDoc.is_published = true;
          }
        }
      );
    }

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
    

////////////////////////////////// MESS AROUND TOWN

$scope.switchHasTitle = function () {
  Write.updateUserDoc('hasTitle', !$scope.hasTitle);
  Write.setCurrentDoc.hasTitle = !$scope.hasTitle;
  $scope.hasTitle = !$scope.hasTitle;
}

}).controller('WriteLeftCtrl', function  ($scope, $modal) {
  
  $scope.openTopicModal = function () {

    var modalInstance = $modal.open({
      templateUrl: "partials/write/topic-modal.html",
      controller: function  ($scope, $modalInstance, userTopics, docTopics, Write) {
        $scope.userTopics = userTopics;
        $scope.docTopics = docTopics;
        $scope.close = function() {
          $modalInstance.close();
        }; 

        $scope.addTopic = function (topicTitle) {
          return Write.updateTopics('add', topicTitle);
        }
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
      controller: function  ($scope, $modalInstance, userTopics, docTopics, doc) {
        $scope.userTopics = userTopics;
        $scope.docTopics = docTopics;
        $scope.close = function() {
          $modalInstance.close();
        }; 
      },
      resolve: {
        userTopics: function () {
          return $scope.user.topics;
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
