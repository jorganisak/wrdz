'use strict';

angular.module('read')
  .factory('Read', ['$http', 'PubDoc', 'User', 'Topics', '$state', function ($http, PubDoc, User, Topics, $state) {


    var docList = {docs: [], query: []};
// list of objects with obj.type and obj.value
    var query = [];
    var prevState = {};
    var nextDocId;

    function checkLength (index) {
      if (docList.docs.length - index < 3) {
        loadMoreDocs(docList.docs.length);
      }
    };

    function loadMoreDocs (length) {
      var oldQuery = docList.query;
      if (oldQuery.length > 2) {
        oldQuery[2].value = length;
      } else {

        oldQuery.push({type:'skip', value: length}) ;
      }
      updateQuery(oldQuery);      
    };

    function goToFront () {
      updateQuery([{type:'topics', value: ''}, 
        {type:'following', value: ''}, 
        {type:'skip', value: ''}]).then(function (res) {
          $state.go('read.doc', {'docId': res.data[res.data.length -1 ]._id})
        });
    };

    function findNextDoc (id) {
      var docs = docList.docs;
      if (docs.length) {

        angular.forEach(docs, function (doc) {
          if (doc._id === id) {
            var index = docs.indexOf(doc);
            console.log(index);
            checkLength(index);

            if (index === docs.length - 1) {
              nextDocId = null;
            } else {
              nextDocId = docs[index + 1]._id;
              
            }

          } 
        })
      }
    };

    function goToNextDoc () {
      $state.go('read.doc', {'docId': nextDocId});
    };

    function updateQuery (newQuery) {
      for (var j=0; j < newQuery.length; j++) {

        var flag = true;

        for (var i=0; i<query.length; i++) {
          if (query[i].type == newQuery[j].type) {
            query[i].value = newQuery[j].value;
            flag = false;
          } 
        }
        if (flag) {
          query.push({'type': newQuery[j].type,'value': newQuery[j].value});
        } 
      }

      var d = PubDoc.list(query);
      d.then(function (res) {
        var toSkip = 0;
        angular.forEach(query, function (q) {
          if (q.type === 'skip') {
            toSkip = q.value;
          }
        })
        if (toSkip > 0) {
          docList.docs = docList.docs.concat(res.data);
        } else {
          docList.docs = res.data;
        }
        docList.query = query;
      });

      return d;
    };



    // Public API here
    return {
      setPrevState : function (state) {
        prevState.name = state.current.name;
        prevState.params = state.params;
        return true;
      },

      getPrevState : function () {
        return prevState;
      },

      getNextDocId : function () {
        return nextDocId;
      },

      goBack: function () {
        var s = prevState;
        if (s) {
          $state.go(s.name, s.params)
        }
      },

      getDocs : function () {
        return docList;
      },

      setDocs : function (docs) {
        docList = docs;
      },
      
      getPubDoc : function (docId) {
        findNextDoc(docId);
        return PubDoc.findOne(docId);
      },

      followUser : function (user, bool) {
        var data = {userId: user._id, bool : bool};
        User.update('addFollowing', data);
   

      },
      getHearts : function () {

        var res =  User.getUser();
        if(!res.meta) {
          return false;
        }
     

        return res.meta._hearts;
  

        
      },

      updateQuery : updateQuery,

      goToNextDoc: goToNextDoc,


      updatePubDoc : function (docId, type, bool) {
        return PubDoc.update(docId, type, bool);
      },

      //TOP TOPICS
      refreshTopics : function () {
        return Topics.getTop()
      },

  

    };
  }]);
