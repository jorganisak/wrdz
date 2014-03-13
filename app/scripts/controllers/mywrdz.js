'use strict';

/*
  Read View Controller

    
*/
angular.module('myWrdz')
.controller('MyWrdzCtrl', ['$scope', '$state', 'MyWrdz', '$stateParams', function ($scope, $state, MyWrdz, $stateParams ) {

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
      $scope.docList = $scope.user._userDocs;
        $scope.showDoc = $scope.user._userDocs[0];
      $scope.topicOptions = $scope.user.topics;
    }

    $scope.$on('userChange', function (evt, user) {
      if (user) {
        if (user._userDocs) {
          $scope.docList = $scope.user._userDocs;
          $scope.showDoc = $scope.user._userDocs[0];
          $scope.topicOptions = $scope.user.topics;

        } else {

        }
      } else {
        $scope.noUser = true;
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


}]);