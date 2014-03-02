'use strict';

angular.module('read')
.controller('ReadCtrl', function ($scope, Read, $state, PubDoc, $stateParams) {

  $scope.moment = moment;

  Read.refreshDocs();

  function arrayTest (docId, a) {
    var res = false;
    angular.forEach(a, function  (item) {
      if (a == item) {
        res = true;
      }
    })
    return res;
  }

  $scope.isHeart = function  () {
    
  }

  if ($scope.user) {
    $scope.seen = $scope.user.meta._views;
  }

  $scope.$on('userChange', function  (evt, user) {
    if (user) {
      $scope.seen = $scope.user.meta._views;
    }
  });

  $scope.docs = Read.getDocs();

  $scope.$watch(Read.getDocs, function  (newValue, oldValue) {
    if (newValue) {
      console.log('loading new docs')
      $scope.docs = newValue;
    }
  });


  ////



        var docId = $stateParams.docId;
          Read.getPubDoc(docId).then(function  (res) {
            $scope.readDoc = res.data;
          });

          $scope.heart = function () {
            PubDoc.update(docId, 'heart', true);
          };
          $scope.up_vote = function () {
            PubDoc.update(docId, 'up_vote', true);
          };
          $scope.view = function () {
            PubDoc.update(docId, 'view', true);
          };

          $scope.view();


});