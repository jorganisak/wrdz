'use strict';

angular.module('wrdz')

  .controller('WriteCtrl', function ($scope, User, Write, Profile, $state) {



    $scope.currentDoc = Write.getCurrentDoc();

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
      if (newValue) {
        console.log('title change');
        Write.updateUserDoc('title',$scope.currentDoc.title);
      }
    });

    $scope.$watch('currentDoc.body', function  (newValue, oldValue) {
      if (newValue) {
        console.log('body change');
        Write.updateUserDoc('body',$scope.currentDoc.body);
      }
    });


    $scope.archive = function () {
      if ($scope.currentDoc.title && $scope.currentDoc.body) {
        Write.archiveDoc().then(
          function (data) {
            Profile.pushDocId(data.data._id);
            Write.updateCurrentDoc('body', '', User.user);
            Write.updateCurrentDoc('title', '', User.user);
            
          }

        );
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

    $scope.newDoc = function  () {
      Write.createNewDoc().then(function  (res) {
        var doc = res.data;
        Write.setCurrentDoc(doc);
        $scope.noDoc = false;
        Write.updateCurrentDoc(doc._id, $scope.user);
      })
    };


  });
