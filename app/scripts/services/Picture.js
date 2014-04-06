'use strict';

/*
  Picture Service
  */

  angular.module('shared')
  .factory('Picture', ['$http',  function ($http) {

      function convertCanvasToImage(canvas) {
        // var image = new Image();
        // image.src = canvas.toDataURL("image/png");
        // return image;
        return canvas.toBlob();
      }




 
      return {

        convert : function (canvas) {
          var image = convertCanvasToImage(canvas);
          console.log(image);
          return image;
        }

    };
}]);
