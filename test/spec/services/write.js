'use strict';

describe('Service: write', function () {

  // load the service's module
  beforeEach(module('templateApp'));

  // instantiate service
  var write;
  beforeEach(inject(function (_write_) {
    write = _write_;
  }));

  it('should do something', function () {
    expect(!!write).toBe(true);
  });

});
