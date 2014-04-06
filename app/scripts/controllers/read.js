'use strict';

/*
  Read View Controller

    
*/
angular.module('read')
  .controller('ReadCtrl', ['$scope', 'Picture', 'Read', '$state', '$filter', '$location', '$window', '$timeout', '$modal',
   function ($scope, Picture, Read, $state, $filter, $location, $window, $timeout, $modal) {


    $scope.Read = Read;

  $scope.tabs = [
    { title: "Front", state: "read.list.front({'skip': null})"},
    { title: "Following", state: "read.list.following({'skip': null})"},
    { title: "Hearts", state: "read.list.hearts({'skip': null})"}
  ];



    $scope.navType = 'pills';

    $scope.moment = moment;
    $scope.left_xs_collapsed = true;


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

    $scope.loadNext = function () {
        var skip = Number($scope.$stateParams.skip) + 10;
        $scope.$state.go($scope.$state.current.name, {'skip' : skip})

    };

    $scope.loadPrev = function () {
        var skip = Number($scope.$stateParams.skip) - 10;
        $scope.$state.go($scope.$state.current.name, {'skip' : skip})

    };

    // Things for read.list.user, maybe eventually move to another controller

    $scope.$on('read_list_author_info', function (evt, author) {
      console.log('author')
      $scope.author_info = author;


      if ($scope.user) {
        testFollow(author._id);
      }
    })


    $scope.$on('userChange', function (evt, user) {
      if (user) {
        if ($scope.author_info) {

          testFollow($scope.author_info._id);
        }
      }
    });

    function testFollow (id) {
       var flag = false;
        angular.forEach($scope.user.following, function (user) {
          if (user._id === id){
            flag = true;
          }
        })
        if (flag) {
          $scope.following = true;
        } else {
          $scope.following = false;
        }
    }

    function checkUser () {
      if ($scope.user) {
        return true;
      } else {
        $scope.launchSignUp();

      }
    }

    $scope.switchDoc = function (doc, isopen) {
      if (!isopen){
        $scope.showStats = true;
        $scope.hideStats = false;
        $scope.readDoc = doc;
        if (doc.author) {
          $scope.$emit('read_list_author_info', doc.author)
          $scope.showUser = true;
        }
        $timeout(function () {
          var top = document.getElementById(doc._id).getBoundingClientRect().top
          var h = $window.pageYOffset;
          $('html,body').animate({
            scrollTop: top+h-5
          }, 200);
          // $window.scrollTo(0, top + h - 105);
        },600)
      } else {
        $scope.readDoc = null;
      }

        
    };

    $scope.openDoc = function (docId) {
      $scope.$state.go('read.doc', {docId : docId});
      
    }

    $scope.follow = function () {
      if (checkUser()) {

        if ($scope.author_info) {

          if ($scope.following) {

            Read.followUser($scope.author_info, false);
            $scope.author_info.followers--;
          } else {
            
            Read.followUser($scope.author_info, true);
            $scope.author_info.followers++;
          }
          $scope.following = !$scope.following;
        }
      }
    }



    $scope.openPictureModal = function (docId) {
      var modalInstance = $modal.open({
        templateUrl: "partials/picture-modal.html",
        controller: ['$scope', '$modalInstance', '$state', 
        function ($scope, $modalInstance, $state) {
          $scope.close = function () {
            $modalInstance.close();
          };

          function s3_upload(file, name){
            var s3upload = new S3Upload({
                // file_dom_selector: 'files',
                file_to_upload: file,
                s3_object_name : name,
                s3_sign_put_url: '/sign_s3',
                onProgress: function(percent, message) {
                    $('#status').html('Upload progress: ' + percent + '% ' + message);
                },
                onFinishS3Put: function(public_url) {
                    $('#status').html('Upload completed. Uploaded to: '+ public_url);
                    $("#avatar_url").val(public_url);
                    $("#preview").html('<img src="'+public_url+'" style="width:300px;" />');
                },
                onError: function(status) {
                    $('#status').html('Upload error: ' + status);
                }
            });
          }


          html2canvas(document.getElementById(docId), 
          {
            onrendered : function (canvas) {
              
              if (canvas.toBlob) {
                canvas.toBlob(
                    function (blob) {
                        // Do something with the blob object,
                        // e.g. creating a multipart form for file uploads:
                       console.log(blob);
                       s3_upload(blob, docId);
                    },
                    'image/jpeg'
                );
              }
            }
          })

        }],
        resolve: {

        }
      });
    };



  }])

 

  .controller('TopicsListCtrl', ['$scope', 'Read', function ($scope, Read) {
    var topTopics;
    var init = function () {
      Read.refreshTopics().then(function (topics) {
        topTopics = topics.data;
        for (var i=0; i<topTopics.length ; i++) {
          $scope.data.push(topTopics[i]);
        }
      });
    }

    init();

    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.data = [];
    $scope.numberOfPages = function(){
      return Math.ceil($scope.data.length/$scope.pageSize);                
    }
    
  }])



  .controller('ReadDocCtrl', ['$scope', 'Read', function ($scope, Read) {
    $scope.isCollapsed = true;

    $scope.nextDoc = function () {
      Read.goToNextDoc();
    };

    $scope.goBack = function () {
      Read.goBack();
    };



    $scope.isHeart = function () {
      if ($scope.user.meta._hearts.indexOf($scope.doc._id) > -1) {
        $scope.active2 = 'active';
        return true;
      }
      return false;
    };
    $scope.isVote = function () {
      if ($scope.user.meta._up_votes.indexOf($scope.doc._id) > -1) {
        $scope.active1 = 'active';
        return true;
      }
      return false;
    };
    $scope.isFollowing = function () {
      if ($scope.doc.author) {
        var flag = false;
        angular.forEach($scope.user.following, function (user) {
          if (user._id === $scope.doc.author._id){
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
          $scope.doc.hearts--;
          $scope.active2 = null;
          Read.updatePubDoc($scope.doc._id, 'heart', false);
        } else {
          $scope.active2 = 'active';
          Read.updatePubDoc($scope.doc._id, 'heart', true);
          $scope.doc.hearts++;
          $scope.user.meta._hearts.push($scope.doc._id);
        }
      }
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


    $scope.view = function () {
      // Check if user to register view
      // TODO, this can surely be worked around to
      // manufacture page views..
      if ($scope.user) {
        if ($scope.user.meta._views.indexOf($scope.doc._id) === -1) {
          Read.updatePubDoc($scope.doc._id, 'view', true);
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

        if ($scope.doc.author) {

          if ($scope.following) {

            Read.followUser($scope.doc.author, false);
            $scope.doc.author.followers--;
          } else {
            
            Read.followUser($scope.doc.author, true);
            $scope.doc.author.followers++;
          }
          $scope.following = !$scope.following;
        }
      }
    }

  

  }]);