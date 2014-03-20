'use strict';

/*
  MyWrdz Service
  */

  angular.module('myWrdz')
  .factory('MyWrdz', ['$http', 'User', 'UserDoc', function ($http, User, UserDoc) {

/*
      Service Logic and declarations
      */
      // list of objects with obj.type and obj.value
      var query = [];

      var docList = [];


/*
    Public API here  



      */

      return {

        getList : function () {
          return docList;
        },

        setList : function (list) {
          docList = list;
        },

        updateQuery : function (type, value) {
          var flag = true;
          for (var i=0; i<query.length;i++) {
            if (query[i].type == type) {
              query[i].value = value;
              flag = false;
            } 
          }
          if (flag) {
            query.push({'type':type,'value':value});
          } 

          UserDoc.list(query).then( function (res) {
            docList = res.data;
          });
        }



    };
}]);
