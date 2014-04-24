'use strict';

/*
  Read View Controller
*/

angular.module('read')
  .controller('ReadCtrl', ['$scope', 'Read', '$window', '$timeout',
   function ($scope, Read, $window, $timeout) {

    //Internal
    $scope.Read = Read;

    $scope.moment = moment;
    $scope.left_xs_collapsed = true;

    // Prompt signin
    function checkUser () {
      if ($scope.user) {
        return true;
      } else {
        $scope.launchSignUp();
      }
    }


    $scope.$on('userChange', function (evt, user) {
      if (user) {
        if ($scope.author_info) {
          testFollow($scope.author_info._id);
        }
      }
    });

    $scope.$on('author_info', function (evt, author) {
      $scope.author_info = author;
    })

    // $scope.switchDoc = function (doc, isopen) {
    //   if (!isopen){
    //     $scope.readDoc = doc;
    //     if (doc.author) {
    //       $scope.author_info = doc.author;
    //       testFollow(doc.author._id)
    //       $scope.showUser = true;
    //     }
    //     $timeout(function () {
    //       var top = document.getElementById(doc._id).getBoundingClientRect().top
    //       var h = $window.pageYOffset;
    //       $('html,body').animate({
    //         scrollTop: top+h-40
    //       }, 200);
    //       // $window.scrollTo(0, top + h - 105);
    //     },600)
    //   } else {
    //     $scope.readDoc = null;
    //   }
        
    // };




  }])


  .controller('ReadDocCtrl', ['$scope', 'Read', function ($scope, Read) {

    $scope.isCollapsed = true;



    $scope.isVote = function () {
      if ($scope.user.meta._up_votes.indexOf($scope.doc._id) > -1) {
        $scope.active1 = 'active';
        return true;
      }
      return false;
    };



    $scope.up_vote = function () {
      if (checkUser()) {

        if ($scope.active1 === 'active') {
          $scope.doc.up_votes--;
          $scope.active1 = null;
          console.log($scope.active1);
          Read.updatePubDoc($scope.doc._id, 'up_vote', false);
        } else {
          $scope.active1 = 'active';
          Read.updatePubDoc($scope.doc._id, 'up_vote', true);
          $scope.doc.up_votes++;
        }
      }
    };




    function checkDoc() {
      $scope.isVote();
    }


    if ($scope.user) {
      checkDoc();
    }

    $scope.$on('userChange', function (evt, user) {
      if (user) {
        checkDoc();
      }
    });

    function checkUser () {
      if ($scope.user) {
        return true;
      } else {
        $scope.launchSignUp();
      }
    }

  

  }]);