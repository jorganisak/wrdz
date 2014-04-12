'use strict';

/*
  Read View Controller

    
*/
angular.module('myWrdz')
.controller('MyWrdzCtrl', ['$scope','$modal', '$state', 'MyWrdz', '$stateParams', '$timeout', '$window',
  function ($scope, $modal, $state, MyWrdz, $stateParams, $timeout, $window ) {

    $scope.moment = moment;

 

    $scope.setToday = function() {
      $scope.date = moment(Date.now()).format('YYYY-MM-DD');
      $scope.today =  $scope.date;
      $scope.maxDate = $scope.today;
    };

    $scope.setToday();

    $scope.filterModel = "All";

    $scope.topicsModel = [];
    $scope.topicOptions = [{}];



    $scope.$watch('date', function (newValue) {
      console.log(newValue);
      $scope.dt = moment(newValue).add('days', 1)._d;
      console.log($scope.dt)
    })




    $scope.isCollapsed = true;
    $scope.topicCollapse = true;
    $scope.dateCollapsed = true;
    $scope.editCollapsed = true;

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
        init(newValue);
      }
    });


    $scope.pageSize = 6;
    $scope.numberOfPages = function(){
      return Math.ceil($scope.data.length/$scope.pageSize);                
    }

    var init = function (docs) {
      $scope.data = [];
      var docs = MyWrdz.getList();
        for (var i=0; i<docs.length ; i++) {
          $scope.data.push(docs[i]);
        }
      $scope.currentPage = 0;
      $scope.starting = $scope.currentPage*$scope.pageSize
    }

    $scope.$watch('currentPage', function (newValue) {
      $scope.starting = $scope.pageSize*newValue;
    })





    $scope.switchDoc = function (doc, isopen) {
      if (!isopen){
        $scope.showDoc = doc;
        if (doc.author) {
          $scope.$emit('read_list_author_info', doc.author)
        }
        $timeout(function () {
          var top = document.getElementById(doc._id).getBoundingClientRect().top
          var h = $window.pageYOffset;
          $('html,body').animate({
            scrollTop: top+h-80
          }, 250);
          // $window.scrollTo(0, top + h - 105);
        },600)
      } else {
        $scope.showDoc = null;
      }
    }

    $scope.addTopic = function (topic) {
      var flag = true;
      angular.forEach($scope.topicsModel, function (t) {
        if (topic._id === t._id) {


          $scope.topicsModel.splice($scope.topicsModel.indexOf(t), 1);
          flag = false;
        }
      })

      if (flag) {
        $scope.topicsModel.push(topic);

      }
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

   
    $scope.switchVisible = function (doc) {
      MyWrdz.switchVisible(doc._id, !doc.pub_doc.is_visible);
      doc.pub_doc.is_visible = !doc.pub_doc.is_visible;
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


    
}])
