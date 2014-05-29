(function() { 'use strict';

function Doc(futureDocData) {
  if (!futureDocData.inspect) {
    _.extend(this, futureDocData);
    return;
  }
  this.$unwrap(futureDocData);
}

Doc.$factory = ['$timeout', 'Resource', function($timeout, Resource) {
  _.extend(Doc, {
    $$resource: new Resource('/docs'),
    $timeout: $timeout
  });
  return Doc;
}];

angular.module('models').factory('Doc', Doc.$factory);

Doc.$find = function(uid) {
  var futureDocData = this.$$resource.find(uid);
  if (uid) return new Doc(futureDocData);
  return Doc.$unwrapCollection(futureDocData);
};

Doc.$create = function() {
  var futureDocData = this.$$resource.create();
  return new Doc(futureDocData);
};

Doc.$remove = function(uid) {
  this.$$resource.remove(uid);
}

Doc.$set = function(uid, newDoc) {
  this.$$resource.set(uid, newDoc);
};

Doc.prototype.$unwrap = function(futureDocData) {
  var self = this;
  this.$futureDocData = futureDocData;
  this.$futureDocData.then(function(data) {
    Doc.$timeout(function() { _.extend(self, data); });
  });
};

Doc.$unwrapCollection = function(futureDocData) {
  var collection = [];
  collection.$futureDocData = futureDocData;
  futureDocData.then(function(docs) {
    Doc.$timeout(function() {
      _.reduce(docs, function(c, doc) {
        c.push(new Doc(doc));
        return c;
      }, collection);
    });
  });
  return collection;
};

})();
