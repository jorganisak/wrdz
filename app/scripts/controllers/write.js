'use strict';

angular.module('wrdz')

  .controller('WriteCtrl', function ($scope, User, Write, Profile, $state, $timeout) {

    //test if i is in array
    // returns true if not in array
    function tagArrayTest (i, a) {
      var res = true;
      angular.forEach(a, function  (item) {
        if (item.title == i.title) {
          res = false;
        }
      });
      return res;
    }

    $scope.currentDoc = Write.getCurrentDoc();

    if ($scope.user) {
      Write.setCurrentDoc($scope.user.current_doc);
    }
    


    $scope.showSidebar = true;

    $scope.$on('userChange', function  (evt, user) {
      if (user) {
        if ( user.current_doc ) {
          $scope.currentDoc = user.current_doc;
          Write.setCurrentDoc($scope.currentDoc);
        } else {
          console.log('No current Doc');
          $scope.noDoc = true;
        }
        
      } else {
        $scope.noUser = true;
      }
    });


    $scope.$watch('currentDoc.title', function  (newValue, oldValue) {
        if (newValue || newValue == '') {
          console.log('title change');
          Write.updateUserDoc('title', $scope.currentDoc.title);
        }
    });

    $scope.$watch('currentDoc.body', function  (newValue, oldValue) {
        if (newValue) {
          console.log('body change');
          Write.updateUserDoc('body', $scope.currentDoc.body);
        }
    });

    $scope.$watch(Write.getCurrentDoc, function  (newValue, oldValue) {
      if (newValue) {
        $scope.currentDoc = newValue;
      }
    });

    $scope.archive = function () {
      if ($scope.currentDoc.title && $scope.currentDoc.body) {
        Write.archiveDoc().then(
          function (data) {
            Profile.pushDocId(data.data._id);
            Write.updateCurrentDoc('body', '', User.user);
            Write.updateCurrentDoc('title', '', User.user);          
          });
      } else {
        // { TODO } error message notifiying user
        console.log('note is empty!!');
      }
    };

    $scope.publish = function () {
      if ($scope.currentDoc.title && $scope.currentDoc.body) {
        Write.publishDoc().then(
          function  () {
            $scope.currentDoc.is_published = true;
            $scope.archive();
          }
        );
      } else {
        // { TODO } error message notifiying user
        console.log('note is empty!!');
      }

    };

    $scope.switchDoc = function  (doc) {
      Write.setCurrentDoc(doc);
      Write.updateCurrentDoc(doc._id, $scope.user);
      $scope.user.current_doc = doc;
    };

    $scope.newDoc = function  () {
      Write.createNewDoc().then(function  (res) {
        var doc = res.data;
        Write.setCurrentDoc(doc);
        $scope.noDoc = false;
        Write.updateCurrentDoc(doc._id, $scope.user);
        $scope.user._userDocs.unshift(doc);
        document.getElementById('write-title').focus();
      })
    };

    $scope.newTag = function  (tagTitle) {
      if (tagTitle) {
        $scope.newTagTitle = '';
        var docId = $scope.currentDoc._id;
        var tagName = tagTitle;
        Write.newTag(tagName, docId, $scope.user).then(function  (res) {
          if (tagArrayTest(res.data, $scope.currentDoc.tags)) $scope.currentDoc.tags.push(res.data);
        });
      }
    };

    $scope.removeTag = function  (tagId) {
      Write.removeTag(tagId, $scope.currentDoc._id, $scope.user);
      for (var i = 0 ; i < $scope.currentDoc.tags.length ; i++ ) {
        if ($scope.currentDoc.tags[i]._id == tagId) {
          $scope.currentDoc.tags.splice(i,1);
        }
      }

    };

    $scope.publishSwitch = function  () {
      $scope.publishBox = !$scope.publishBox;
    };


    $scope.publish  = function(anon) {
      Write.publishDoc(anon, $scope.user);
    }

    $scope.switchSidebar = function  () {
      $scope.showSidebar = !$scope.showSidebar;
    }


  });
