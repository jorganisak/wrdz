'use strict';

angular.module('wrdz')

  .controller('WriteCtrl', function ($scope, User, Write, $state) {



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
      if ($scope.currentDoc.title || $scope.currentDoc.body) {
        Write.archiveDoc().then(
          function () {

            Write.updateCurrentDoc('body', '');
            Write.updateCurrentDoc('title', '');
            $state.go('me');
            
          }

        );
      } else {
        console.log('note is empty!!')
      }

    };


  });
