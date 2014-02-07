angular.module('perfect_scrollbar', []).directive('perfectScrollbar', function($timeout, $parse) {
  return {
    restrict: 'E',
    transclude: true,
    template:  '<div><div ng-transclude></div></div>',
    replace: true,
    link: function($scope, $elem, $attr) {
      $elem.perfectScrollbar({
        wheelSpeed: $parse($attr.wheelSpeed)() || 50,
        wheelPropagation: $parse($attr.wheelPropagation)() || false,
        minScrollbarLength: $parse($attr.minScrollbarLength)() || false,
        suppressScrollX: true,
        scrollXMarginOffset: 60
      });

      if ($attr.refreshOnChange) {
        $scope.$watchCollection($attr.refreshOnChange, function(newNames, oldNames) {
          // I'm not crazy about setting timeouts but it sounds like thie is unavoidable per
          // http://stackoverflow.com/questions/11125078/is-there-a-post-render-callback-for-angular-js-directive
          setTimeout(function() { $elem.perfectScrollbar('update'); }, 10);
        });
        $scope.$watch($attr.currentIndex, function(newIndex, oldIndex) {
          var magicNum = 6;
          var scrollNum = 290;
          var scrollLoc = $elem.scrollTop();
          var j = Math.floor(newIndex / magicNum);
          var i = scrollNum * j;
          // if ( scrollLoc / scrollNum !== j * scrollNum ) {
          //   $elem.scrollTop(i);

          //  }
          if ( scrollLoc / scrollNum !== j * scrollNum ) {

            $elem.animate({scrollTop: i}, 250);
            setTimeout(function() { $elem.perfectScrollbar('update'); }, 10);
           }     
          
        });
      }
    }
  }
});