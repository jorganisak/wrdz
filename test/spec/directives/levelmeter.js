'use strict';

describe('Directive: levelMeter', function () {

  // load the directive's module
  beforeEach(module('wrdz'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<level-meter></level-meter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the levelMeter directive');
  }));
});
