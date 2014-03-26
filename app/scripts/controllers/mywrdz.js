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

    $scope.topicsModel = [];
    $scope.topicOptions = [{}];
    $scope.viewArchived = false;




    $scope.isCollapsed = true;
    $scope.topicCollapse = true;

    var dtTypes = ['Days', 'Weeks', 'Months'];

    $scope.dtCount = 0;
    $scope.dtType = 'Days';

    $scope.increaseCount = function () {
      $scope.dtCount++;
    };


    $scope.decreaseCount = function () {
      if ($scope.dtCount !== 0) {
        $scope.dtCount--;
      }
    };

    $scope.increaseType = function () {
      var index = dtTypes.indexOf($scope.dtType);
      if (index === dtTypes.length -1) {
        $scope.dtType = dtTypes[0];
      } else {
        $scope.dtType = dtTypes[index + 1];
      }
    };
    $scope.decreaseType = function () {
      var index = dtTypes.indexOf($scope.dtType);
      if (index === 0) {
        $scope.dtType = dtTypes[dtTypes.length - 1];
      } else {
        $scope.dtType = dtTypes[index - 1];
      }
    };

    $scope.getDtOther = function  () {
      var num = $scope.dtCount;
      var type = $scope.dtType;

      if (type === 'Days') {
        $scope.dt = $scope.today - (86400000 * num);
      }
      if (type === 'Weeks') {

        $scope.dt = $scope.today - (604800000 * num);
      }
      if (type === 'Months') {
        $scope.dt = $scope.today - (2629740000 * num);
      }
    };

    $scope.$watch('dtCount', function (newValue) {
      if (newValue) {
        $scope.getDtOther();
      }
    });

    $scope.$watch('dtType', function (newValue) {
      if (newValue) {
        $scope.getDtOther();
      }
    });

    $scope.$watch('dt', function (newValue) {
      if (newValue) {
        MyWrdz.updateQuery('date', newValue + 43000000)
      }
    });

    $scope.$watch('viewArchived', function (newValue) {
      MyWrdz.updateQuery('archive', newValue)
    })

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
      $scope.topicsModel.splice($scope.topicsModel.indexOf(topic._id), 1);
    }

    $scope.openDocInWrite = function (doc) {
      $scope.user.current_doc = doc;
      $state.go('write');
    };

    $scope.archive = function (docId) {
      var bool = $scope.showDoc.is_archived;
      MyWrdz.archive(docId, !bool);
      $scope.showDoc = null;
    };

   
    $scope.switchVisible = function () {
      MyWrdz.switchVisible($scope.showDoc._id, !$scope.showDoc.pub_doc.is_visible);
      $scope.showDoc.pub_doc.is_visible = !$scope.showDoc.pub_doc.is_visible;
    };

 
    $scope.openTopicModal = function () {
      var modalInstance = $modal.open({
        templateUrl: "partials/topic-modal.html",
        controller:  ['$scope', '$modalInstance', 'userTopics', 'docTopics', 'Topics', 'currentDoc', function ($scope, $modalInstance, userTopics, docTopics, Topics, currentDoc) {
          $scope.userTopics = userTopics;
          $scope.docTopics = docTopics;
          $scope.close = function () {
            $modalInstance.close();
          };

          $scope.removeTopic = function (topic) {
            Topics.update(currentDoc._id, 'remove', topic.title).then(
              function () {
                $scope.docTopics.splice($scope.docTopics.indexOf(topic), 1);
              }
            );
          };

          $scope.addTopic = function (topicTitle) {
            Topics.update(currentDoc._id, 'add', topicTitle).then(
              function () {
                $scope.docTopics.push({'title': topicTitle});
              }
            );
          };
        }],
        resolve: {
          userTopics: function () {
            return $scope.user.topics;
          },

          currentDoc : function () {
            return $scope.showDoc;
          },

          docTopics: function () {
            return $scope.showDoc.topics;
          }
        }
      });
    };
}]);