'use strict';

/*
  Picture Service
  */

  angular.module('shared')
  .factory('Picture', ['$http',  function ($http) {

   




 
      return {

        tweetPic : function (user, pic, id, message) {
          var url = "http://www.wrdz.co/r/"+id;
          var data = {
            user: user,
            pic : pic,
            url : url,
            message : message
          }
          $http.post('/twitterPic', data).success(function (res) {
            console.log(res);
          });
        }

    };
}]);
