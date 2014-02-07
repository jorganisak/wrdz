'use strict';

describe('Directive: nodeFunctions', function () {

  // load the directive's module
  beforeEach(module('wrdz'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<node-functions></node-functions>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the nodeFunctions directive');
  }));
});
