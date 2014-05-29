
angular.module('write').controller('DocsCtrl', ['$scope', '$timeout', 'Doc', 'Write',
  function ($scope, $timeout, Doc, Write) {
    $scope.moment = moment;

    $scope.datesShowing = [];
    $scope.docs = Doc.$find();
    console.log($scope.docs);

    $scope.newDoc = function() {
      var doc = Doc.$create();
      doc.updated_at = moment().format();
      $scope.docs.push(doc);
      $timeout(function() {
        document.getElementById(doc._id).focus();
      }, 200);
    }
    $scope.remove = function(doc) {
      Doc.$remove(doc._id);
      $scope.docs.splice($scope.docs.indexOf(doc), 1);
    };

    $scope.mediumEditorOptionsBody = Write.getMediumOptions;

    $scope.bodyChange = function (doc) {
      Doc.$set(doc._id, doc)
    };
    
}])
