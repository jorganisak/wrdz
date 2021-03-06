'use strict';
angular.module('shared')


.directive('writeUnit', function() {
  return {
    restrict: 'AE',
    templateUrl: 'partials/write-unit.html',
    scope: {
      doc : '=doc',
      user: '=user',
      tweetModal: '&tweet',
    },
    controller: ['$scope', '$timeout', 'Write', function ($scope, $timeout, Write) {
      $scope.mediumEditorOptionsBody = Write.getMediumOptions;
      $scope.moment = moment;
      $scope.shelfCollapsed = true;
      $scope.showDoc = true;


      $scope.archive = function () {
        var okToArchive = true;
        $scope.showArchiveWarning = true;
        $scope.showDoc = false;

        $scope.cancelArchive = function () {
          $scope.showDoc = true;
          $scope.showArchiveWarning = false;
          okToArchive = false;
        }

        $timeout(function () {
          if (okToArchive) {
            $scope.showArchiveWarning = false;
            Write.updateUserDoc('archive', true, $scope.doc._id);
          }
        }, 3000)

      };

      // Publish doc
      $scope.publish = function (isAnon) {
        Write.publishDoc(isAnon, $scope.doc._id).then(
          function (res) {
            if (res.status === 201) {
              $scope.doc.is_published = true;
              $scope.doc.pub_doc = res.data;
            }
          }
        );
      };

      function isPublic () {
        if ($scope.doc.is_published) {
          if ($scope.doc.pub_doc.is_visible) {
            return true
          } 
        }
        return false;
      }
      $scope.tweet = function () {
        $scope.tweetModal({docId: $scope.doc._id, pub: isPublic()});
      }

      $scope.switchVisible = function () {
        Write.updateUserDoc('pubVisible', !$scope.doc.pub_doc.is_visible, $scope.doc._id);
        $scope.doc.pub_doc.is_visible = !$scope.doc.pub_doc.is_visible;
      };


      $scope.bodyChange = function () {
        $timeout(function () {
          if ($scope.doc.body) {
            Write.updateUserDoc('body', {'body': $scope.doc.body}, $scope.doc._id);
          }
        }, 500)
      };

    }],

    link: function (scope, elem, attrs, ctrl) {

    }

  }
})

.directive('twitterButton', ['$window', function($window) {
  return {
    restrict: 'AE',
    replace: true,
    controller: function ($scope, $window) {
      var open = function(docId) {
        console.log('going'); 
        var url = "https://twitter.com/intent/tweet?text=" + '' + "&url=" + 'http://wrdz.co/r/' + docId;
        var popup;
        popup = {
          width: 500,
          height: 350
        };
        popup.top = (screen.height / 2) - (popup.height / 2);
        popup.left = (screen.width / 2) - (popup.width / 2);
        $window.open(url, 'targetWindow', "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=" + popup.left + ",top=" + popup.top + ",width=" + popup.width + ",height=" + popup.height);
      };

      $scope.open = open;
    },

    link: function (scope, elem, attrs, ctrl) {

    }
  }
}])
