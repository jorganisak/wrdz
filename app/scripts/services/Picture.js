'use strict';

/*
  Picture Service
  */

  angular.module('shared')
  .factory('Picture', ['$http',  function ($http) {

      function convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
      }


      return {

        convert : function (canvas) {
          var image = convertCanvasToImage(canvas);
          // $http.post('/picture', image);
        }





    };
}]);
