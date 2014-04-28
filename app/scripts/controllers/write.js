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

    $scope.loadMore = function () {
      console.log('loading more')
      Write.loadMoreDocs();
    }

    $scope.$on("focus-doc", function (evt, id) {
        console.log(id);
        $timeout(function () {
          document.getElementById(id).focus();
        }, 200)
    })



    /*
      MODALS 
    */


     $scope.openTweetModal = function (docId, pub) {

        
        var modalInstance = $modal.open({
          templateUrl: "partials/tweet-modal.html",
          controller: ['$scope', 'Write', '$modalInstance', 'user', 'Picture',
          function ($scope, Write, $modalInstance, user, Picture) {
            $scope.user = user;
            var img = "";
            $scope.message = '';
            $scope.includePhoto = true;


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

            if (docId && pub) {
              getShortUrl(docId).then(function (res) {
                var url = res.data;
                $scope.message = " " + url;
              })
            }



            var prevWidth = document.getElementById(docId).offsetWidth;
            document.getElementById(docId).style.width="320px";
            html2canvas(document.getElementById(docId), 
            {

              onrendered : function (canvas) {
                document.getElementById('twitter-preview').appendChild(canvas);

                document.getElementById(docId).style.width=prevWidth+"px";
                img = canvas.toDataURL("image/png");
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

