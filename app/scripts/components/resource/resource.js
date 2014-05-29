(function() { 'use strict';

function Resource($http, path) {
  _.extend(this, {
    _http: $http,
    _path: path
  });
}

Resource.$factory = ['$http', function($http) {
  return function(path) {
    return new Resource($http, path);
  };
}];

angular.module('shared').factory('Resource', Resource.$factory);

Resource.prototype.path = function(uid) {
  return uid ? this._path + '/' + uid : this._path;
};

Resource.prototype.set = function(uid, newValue) {
  var deferred = Q.defer();
  var path = this._path + '/' + uid;
  this._http
    .put(path, newValue)
    .success(deferred.resolve)
    .error(deferred.reject);
  return deferred.promise;
};

Resource.prototype.create = function() {
  var deferred = Q.defer();
  var path = this._path;
  this._http
    .post(path)
    .success(deferred.resolve)
    .error(deferred.reject);
  return deferred.promise;
}

Resource.prototype.remove = function (uid) {
  var deferred = Q.defer();
  var path = this._path + '/' + uid;
  this._http
    .delete(path)
    .success(deferred.resolve)
    .error(deferred.reject);
  return deferred.promise;
}

Resource.prototype.find = function(uid) {
  var deferred = Q.defer();
  var path;
  if (uid) path = this._path + '/' + uid;
  else path = this._path;
  this._http
    .get(path)
    .success(deferred.resolve)
    .error(deferred.reject);
  return deferred.promise;
};

})();
