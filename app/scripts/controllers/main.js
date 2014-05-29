'use strict';

angular.module('shared').controller('MainCtrl', ['$scope', 'User', '$modal', '$window','$timeout', 
  function ($scope, User, $modal, $window, $timeout) {

    function getUser () {
      var u = User.getUser();
      if (u && !u._userDocs) {
        User.getCurrentUser(u._id).success(function  (data) {
          User.changeUser(data.user);
        }).error(function  (data) {
        });
      }
    }

    getUser();

    $scope.$on('userChange', function(event, user) {
      if (user) {
        $scope.user = user;
      } else {
        $scope.user = null;
      }
    });

    $scope.goToTop = function () {
      $window.scrollTo(0, 0);
    };

    $scope.bodyClick = function () {
      $scope.$broadcast('bodyClick');
    };

    $scope.aboutModal = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/about-modal.html",
        controller: ['$scope', '$modalInstance', '$http', function  ($scope, $modalInstance, $http) {
          $scope.close = function() {
            $modalInstance.close();
          }; 
          $scope.feedbackModal = function () {
            $scope.close();
            var modalInstance = $modal.open({
              templateUrl: "partials/feedback-modal.html",
              controller: ['$scope', '$modalInstance', '$http', function  ($scope, $modalInstance, $http) {
                $scope.close = function() {
                  $modalInstance.close();
                }; 
                $scope.submitFeedback = function (feedback) {
                  console.log(feedback);
                  var data = {'content': feedback}
                  $scope.close();
                  return $http.post('/feedback', data);
                };
              }],
            });
          };
        }],
      });
    };
}])
