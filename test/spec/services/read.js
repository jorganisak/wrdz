'use strict';

describe('Service: Read', function () {

  // load the service's module
  beforeEach(module('templateApp'));

  // instantiate service
  var Read;
  beforeEach(inject(function (_Read_) {
    Read = _Read_;
  }));

  it('should do something', function () {
    expect(!!Read).toBe(true);
  });

});
