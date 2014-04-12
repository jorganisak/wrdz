'use strict';

/*
  Picture Service
  */

  angular.module('shared')
  .factory('Picture', ['$http',  function ($http) {

   




 
      return {

        tweetPic : function (user, pic) {
          var data = {
            user: user,
            pic : pic
          }
          return $http.post('/twitterPic', data);
        }

    };
}]);
