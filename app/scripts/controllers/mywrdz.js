'use strict';

/*
  Read View Controller

    
*/
angular.module('myWrdz')
.controller('MyWrdzCtrl', ['$scope','$modal', '$state', 'MyWrdz', '$stateParams', function ($scope, $modal, $state, MyWrdz, $stateParams ) {

    $scope.moment = moment;

    $scope.setToday = function() {
      $scope.dt = new Date();
      $scope.today =  new Date();
    };

    $scope.setToday();

    $scope.filterModel = "All";
    // $scope.sortModel = "Date";

    $scope.topicsModel = [];
    $scope.topicOptions = [{}];


    $scope.isCollapsed = true;


    $scope.$watch('dt', function (newValue) {
      if (newValue) {
        MyWrdz.updateQuery('date', newValue.getTime() + 43000000)
      }
    });
    $scope.$watch('filterModel', function (newValue) {
      if (newValue) {
        MyWrdz.updateQuery('filter', newValue);
      }
    });

    $scope.$watchCollection('topicsModel', function (newValue) {
      if (newValue) {
        var send = [];
        for (var i=0; i<newValue.length; i++) {
          send.push(newValue[i].topicId);
        }
        MyWrdz.updateQuery('topics', send);
      }
    });



    // $scope.$watch('sortModel', function (newValue) {
    //   if (newValue) {
    //     MyWrdz.updateQuery('sort', newValue);
    //   }
    // })

    if ($scope.user) {
      MyWrdz.setList($scope.user._userDocs);
      $scope.topicOptions = $scope.user.topics;
    }

    $scope.$on('userChange', function (evt, user) {
      if (user) {
        if (user._userDocs) {
          MyWrdz.setList($scope.user._userDocs);
          $scope.topicOptions = $scope.user.topics;
        } 
      } 
    });


    $scope.$watch(MyWrdz.getList, function (newValue) {
      if (newValue) {
        $scope.docList = newValue;
      }
    });

    $scope.switchDoc = function (doc) {
      $scope.showDoc = doc;
    }

    $scope.addTopic = function (topic) {
      $scope.topicsModel.push(topic);
    }

    $scope.removeTopic = function (topic) {
      $scope.topicsModel.splice($scope.topicsModel.indexOf(topic), 1);
    }

    $scope.openDocInWrite = function (doc) {
      $scope.user.current_doc = doc;
      $state.go('write');
    };


    $scope.openPubOptionsModal = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/publish-options-modal.html",
        controller: ['$scope', 'Write', '$modalInstance', '$state', 'doc','username', function ($scope, Write, $modalInstance, $state, doc, username) {
          $scope.close = function () {
            $modalInstance.close();
          };

          $scope.doc = doc;

          $scope.username = username;

          $scope.switchVisible = function () {
            Write.updateUserDoc('pubVisible', !$scope.doc.pub_doc.is_visible);
            $scope.doc.pub_doc.is_visible = !$scope.doc.pub_doc.is_visible;
            $scope.close();
          };
  
        }],
        resolve: {

          doc : function () {
            return $scope.showDoc;
          },

          username : function () {
            return $scope.user.username;
          }
        }
      });
    };

}]);