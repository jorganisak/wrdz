'use strict';

/*
  Write Controller
*/

angular.module('write').controller('WriteCtrl', ['$scope', 'Write', '$timeout', '$window', '$modal', 'Picture',
  function ($scope, Write, $timeout, $window, $modal, Picture) {


  /*
    Init
    */

    // If user, set Write service current_doc to that users current
    if ($scope.user) {
      if ($scope.user._userDocs[0]) {

        Write.setDocs($scope.user._userDocs);

      } else if (!$scope.user._userDocs[0]) {
        Write.createFirstDoc();
      }
    }

  /*
    Watches
    */

    // On user change (sent from User service)
    // Sets Write service doc to current from user
    $scope.$on('userChange', function (evt, user) {
      if (user) {
        Write.setDocs($scope.user._userDocs);
        if (!$scope.user._userDocs[0]) {
          Write.createFirstDoc();
        }
      }
    });

    $scope.$watchCollection(Write.getDocs, function (newValue) {
      if (newValue) {
        $scope.docs = newValue;
      }
    });

    $scope.newDoc = function () {
      Write.createNewDoc();
    };


    /*
      MODALS 
    */


    $scope.openPublishModal = function () {
      if (!$scope.currentDoc.is_published) {
        
        var modalInstance = $modal.open({
          templateUrl: "partials/publish-modal.html",
          controller: ['$scope', 'Write', '$modalInstance', '$state', 'doc', 'user', 'Picture', 'openTweetModal',
          function ($scope, Write, $modalInstance, $state, doc, user, Picture, openTweetModal) {
            $scope.user = user;
            $scope.anon = false;
            var img = "";
            var tweet = false;

            $scope.setTweetFlag = function () {
              tweet = true;
            }

            if (user) {
              $scope.username = user.username;
              if (user.twitter.username) {
                $scope.twitterOpts = true;
              } else {
                $scope.publishOpts = true;
                $scope.twitterOpts = false;
              }
            }

            $scope.close = function () {
              $modalInstance.close();
            };





            $scope.openTweet = function (docId) {
              $scope.close();
              openTweetModal(docId);
            }

          }],
          resolve: {
            user : function () {
                return $scope.user;
            },

            doc : function () {
              return $scope.currentDoc;
            },

            openTweetModal : function () {
              return $scope.openTweetModal;
            }
          }
        });
      }
    };

     $scope.openTweetModal = function (docId) {

        
        var modalInstance = $modal.open({
          templateUrl: "partials/tweet-modal.html",
          controller: ['$scope', 'Write', '$modalInstance', '$state', 'user', 'Picture',
          function ($scope, Write, $modalInstance, $state, user, Picture) {
            $scope.user = user;
            var img = "";
            $scope.message = '';


            $scope.close = function () {
              $modalInstance.close();
            };

            function tweetPic (img) {
              //id is optional
              console.log($scope.message)
              var message = document.getElementById('twitter-message').value;
              Picture.tweetPic(user, img, message);
              $scope.close();
            }

            function getShortUrl (docId) {
              return Picture.shortUrl(docId)
            }

            $scope.sendTweet = function () {
              tweetPic(img);
            }

            if (docId) {
              getShortUrl(docId).then(function (res) {
                var url = res.data;
                $scope.message = " " + url;
              })
            }



            var prevWidth = document.getElementById("write-center").offsetWidth
            document.getElementById("write-center").style.width="500px";
            html2canvas(document.getElementById('write-center'), 
            {

              onrendered : function (canvas) {
                document.getElementById('twitter-preview').appendChild(canvas);

                document.getElementById("write-center").style.width=prevWidth+"px";
                img = canvas.toDataURL("image/png");

                // if (canvas.toBlob) {
                //   canvas.toBlob(
                //       function (blob) {
                //         console.log(blob)
                //           // Do something with the blob object,
                //           // e.g. creating a multipart form for file uploads:
                //          img = blob;

                //       },
                //       'image/png'
                //   );
                // }
              }
            })


          }],
          resolve: {
            user : function () {
                return $scope.user;
            }
          }
        });

    };

}])

