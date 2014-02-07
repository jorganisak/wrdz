'use strict';

describe('Directive: mediumJs', function () {

  // load the directive's module
  beforeEach(module('wrdz'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<medium-js></medium-js>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mediumJs directive');
  }));
});
