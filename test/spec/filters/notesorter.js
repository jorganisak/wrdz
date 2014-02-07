'use strict';

describe('Filter: noteSorter', function () {

  // load the filter's module
  beforeEach(module('wrdz'));

  // initialize a new instance of the filter before each test
  var noteSorter;
  beforeEach(inject(function ($filter) {
    noteSorter = $filter('noteSorter');
  }));

  it('should return the input prefixed with "noteSorter filter:"', function () {
    var text = 'angularjs';
    expect(noteSorter(text)).toBe('noteSorter filter: ' + text);
  });

});
