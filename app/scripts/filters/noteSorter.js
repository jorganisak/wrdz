'use strict';

angular.module('wrdz')
  .filter('noteSorter', function ($filter) {
    return function (notes) {

      var notPinned = [];

      var pinned = [];


      angular.forEach(notes, function(note){
        if (note.data.pinned) {
          this.push(note);
        } else {
          notPinned.push(note);
        }
      }, pinned);

      var sortedPinned = $filter('orderBy')(pinned, 'data.updated');
      var sortedNotPinned = $filter('orderBy')(notPinned, '-data.updated');

      var result = sortedPinned.concat(sortedNotPinned);


      return result;
    };
  });
