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

        switchVisible : function (docId, bool) {
          UserDoc.update(docId, 'pubVisible', bool);
        },

        archive : function (docId, bool) {
          UserDoc.update(docId, 'archive', bool);
            angular.forEach(docList, function (doc) {
              if (doc._id === docId) {
                docList.splice(docList.indexOf(doc), 1);
                
              }
            })
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
