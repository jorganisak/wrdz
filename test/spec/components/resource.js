describe('resourceService', function () {
  var Resource,
    httpBackend;

  beforeEach(function () {
    module('wrdz');

    inject(function($httpBackend, _Resource_) {
      Resource = _Resource_;
      httpBackend = $httpBackend;
    });
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it ('should work!', function() {
    var returnData = { working: true };
    httpBackend.when('GET', '/docs').respond({working:true});
    httpBackend.expectGET('/docs');

    var R = new Resource('/docs');

    var returnedPromise = R.get();

    var result;

    returnedPromise.then(function(response) {
      result = response;
      expect(result).toEqual(returnData);
    });

    httpBackend.flush();
  });
});


