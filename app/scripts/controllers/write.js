'use strict';

angular.module('wrdz')

  .controller('WriteCtrl', function ($scope, User, Write, Profile, $state) {



    $scope.currentDoc = Write.getCurrentDoc();

    $scope.$on('userChange', function  (evt, user) {
      if (user) {
        $scope.currentDoc.title = user.current_doc.title;
        $scope.currentDoc.body = user.current_doc.body;
        Write.setCurrentDoc($scope.currentDoc);
        
      }

    });


    $scope.$watch('currentDoc.title', function  (newValue, oldValue) {
      if (newValue) {
        Write.updateCurrentDoc('title',$scope.currentDoc.title, User.user);
      }
    });

    $scope.$watch('currentDoc.body', function  (newValue, oldValue) {
      if (newValue) {
        Write.updateCurrentDoc('body',$scope.currentDoc.body, User.user);
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


  });
