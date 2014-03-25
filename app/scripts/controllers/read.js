'use strict';

/*
  Read View Controller

    
*/
angular.module('read')
  .controller('ReadCtrl', ['$scope', 'Read', '$state', '$filter', function ($scope, Read, $state, $filter) {

    // Implement if doc has been seen, appear very shaded
    if ($scope.user) {
      $scope.seen = $scope.user.meta._views;
    }

    $scope.$on('userChange', function (evt, user) {
      if (user) {
        $scope.seen = $scope.user.meta._views;
      }
    });


    $scope.tabs = [
      { title: "Front", state: "read.list.front"},
      { title: "Following", state: "read.list.following"},
      { title: "Topics", state: "read.list.topics"}
    ];
    $scope.navType = 'pills';

    $scope.moment = moment;

    $scope.init = function () {
      Read.refreshTopics().then(function (topics) {
        $scope.topTopics = topics.data;
      });
    }

    $scope.init();

    $scope.$watch('$state.current.name', function (newValue) {
      if (newValue) {
        angular.forEach($scope.tabs, function (tab) {
          if ($filter('lowercase')(tab.title) === newValue.slice(10)) {
            tab.active = true;
          } else {
            tab.active = false;
          }
        })
      }
    })

   
  }])


  .controller('ReadDocCtrl', ['$scope', 'Read', function ($scope, Read) {
    function checkLength (docs, doc) {
      var index = docs.indexOf(doc)
      if (index < 3) {
        loadMoreDocs(docs.length);
      }
    };

    function loadMoreDocs (length) {
      var oldQuery = Read.getDocs().query;
      if (oldQuery.length > 2) {
        oldQuery[2].value = length;
      } else {

        oldQuery.push({type:'skip', value: length}) ;
      }
      Read.updateQuery(oldQuery);      
    };

    function goToFront () {
      Read.updateQuery([{type:'topics', value: ''}, 
        {type:'following', value: ''}, 
        {type:'skip', value: ''}]).then(function (res) {
          $scope.$state.go('read.doc', {'docId': res.data[res.data.length -1 ]._id})
        });
    };

    function findNextDoc (doc) {
      var lastDoc;
      var id = doc._id;
      var docs = Read.getDocs().docs;
      if (docs.length) {

        angular.forEach(docs, function (doc) {
          if (doc._id === id) {
            checkLength(docs, doc);
            if (lastDoc) {
              $scope.$state.go('read.doc', {'docId':lastDoc._id});
            } else {
              goToFront();
            }
          } else {
            lastDoc = doc;
          }
        })
      } else {
        goToFront();
      }
    };

    $scope.nextDoc = function () {
      findNextDoc($scope.readDoc);
    };


    $scope.isHeart = function () {
      if ($scope.user.meta._hearts.indexOf($scope.readDoc._id) > -1) {
        $scope.active2 = 'active';
        return true;
      }
      return false;
    };
    $scope.isVote = function () {
      if ($scope.user.meta._up_votes.indexOf($scope.readDoc._id) > -1) {
        $scope.active1 = 'active';
        return true;
      }
      return false;
    };
    $scope.isFollowing = function () {
      if ($scope.readDoc.author) {
        var flag = false;
        angular.forEach($scope.user.following, function (user) {
          if (user._id === $scope.readDoc.author._id){
            flag = true;
          }
        })

        if (flag) {

          $scope.following = true;

        } else {

          $scope.following = false;
        }
      }
    };

    $scope.heart = function () {
      if (checkUser()) {
        
        if ($scope.active2 === 'active') {
          $scope.readDoc.hearts--;
          $scope.active2 = null;
          Read.updatePubDoc($scope.readDoc._id, 'heart', false);
        } else {
          $scope.active2 = 'active';
          Read.updatePubDoc($scope.readDoc._id, 'heart', true);
          $scope.readDoc.hearts++;
        }
      }
    };

    $scope.up_vote = function () {
      if (checkUser()) {

        if ($scope.active1 === 'active') {
          $scope.readDoc.up_votes--;
          $scope.active1 = null;
          console.log($scope.active1);
          Read.updatePubDoc($scope.readDoc._id, 'up_vote', false);
        } else {
          $scope.active1 = 'active';
          Read.updatePubDoc($scope.readDoc._id, 'up_vote', true);
          $scope.readDoc.up_votes++;
        }
      }
    };


    $scope.view = function () {
      // Check if user to register view
      // TODO, this can surely be worked around to
      // manufacture page views..
      if ($scope.user) {
        if ($scope.user.meta._views.indexOf($scope.readDoc._id) === -1) {
          Read.updatePubDoc($scope.readDoc._id, 'view', true);
        }
      }
    };

    function checkDoc() {
      $scope.view();
      $scope.isHeart();
      $scope.isVote();
      $scope.isFollowing();
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


    $scope.follow = function () {
      if (checkUser()) {

        if ($scope.readDoc.author) {

          if ($scope.following) {

            Read.followUser($scope.readDoc.author._id, false);
            $scope.readDoc.author.followers--;
          } else {
            
            Read.followUser($scope.readDoc.author._id, true);
            $scope.readDoc.author.followers++;
          }
          $scope.following = !$scope.following;
        }
      }

    }

  }]);