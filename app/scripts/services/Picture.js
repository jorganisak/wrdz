'use strict';

/*
  Picture Service
  */

  angular.module('shared')
  .factory('Picture', ['$http',  function ($http) {

   




 
      return {

        tweetPic : function (user, pic, message) {
          var data = {
            user: user,
            pic : pic,
            message : message
          }
          $http.post('/twitterPic', data).success(function (res) {
            console.log(res);
          });
        },

        shortUrl : function (docId) {
          var data = {
            url  : "http://www.wrdz.co/r/" + docId
          }

          return $http.post('/shortenUrl', data);
        }

    };
}]);
