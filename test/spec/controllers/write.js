'use strict';


  beforeEach(module('models'));
  beforeEach(module('vendor'));
  // beforeEach(module('shared'));

  // var $cookieStore;

  // beforeEach(inject(function (_$cookieStore_) {
  //   $cookieStore = _$cookieStore_;
  // }))

describe('Controller: WriteCtrl', function () {

  // load the controller's module
  beforeEach(module('write'));


  var scope, $timeout, $window, Write, ctrl;
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$timeout_, _$window_, _Write_) {
    Write = _Write_;

    $timeout = _$timeout_;
    $window = _$window_;
    scope = $rootScope.$new();
    ctrl = $controller('WriteCtrl', {
      $scope: scope,
      Write: Write,
      $timeout: $timeout,
      $window: $window

    });
  }));

  it('should define medium body options', function () {
    expect(scope.mediumEditorOptionsBody).toBeDefined();
  });

  it('should define medium title options', function () {
    expect(scope.mediumEditorOptionsTitle).toBeDefined();
  });


  it('should set currentDoc from write if available', function () {
    expect(scope.currentDoc).toEqual(Write.getCurrentDoc());
  })

  it('should change title things when title switches', function () {
    scope.hasTitle = false;
    Write.setCurrentDoc({'has_title':false})
    scope.switchHasTitle();

    expect(scope.hasTitle).toBe(true);
    expect(Write.getCurrentDoc().has_title).toBe(true);


  })
});
