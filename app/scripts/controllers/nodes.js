'use strict';

angular.module('wrdz')
  .controller('NodesCtrl', function ($scope, $q, $rootScope, $timeout, $window) {



    // find node in nodeList w/ position
    function getNodeInPos(position) {
        if (_.isString(position)) {
          position = parseInt(position);
        }
        return _.find($scope.nodes, function(node){
            return node.position === position;
          });
      }

    function movePageToNode(position) {
      var top = document.getElementById('node'+position).getBoundingClientRect().top;
      // console.log($window.scrollY);
      var bot = document.getElementById('node'+position).getBoundingClientRect().bottom;

      // if ($window.innerHeight <= top){
      //   var el = angular.element(document.body);
      //   console.log('below fold');
      //   el.animate({scrollTop: top}, 100);

      // } 
      if ( $window.innerHeight - bot < 50) {
        console.log('close to bottom');
        var el = angular.element(document.body);

        el.animate({scrollTop: el.scrollTop() + 225}, 250);
      } 
      if (top < 50) {
        console.log('close to top');
        var el = angular.element(document.body);
        el.animate({scrollTop: el.scrollTop() - 225}, 250);
      }
    }


    // focus node in nodeList by position
    function focusNode(position) {
      if (position[0] === 'n') {
        position = position.slice(4);
      }
      $scope.currentNode = parseInt(position);

      document.getElementById('node'+position).focus();
      //console.log("Focusing Node: "+ position);

      movePageToNode(position);
      
    }

    function bootstrap() {
      if ($scope.currentNote) {
        $scope.nodes = $scope.currentNote.nodes;
        $scope.currentNode = 0;
      }
    }

    function selectNode(position) {
      if (position[0] === 'n') {
        position = position.slice(4);
      }
      var el = document.getElementById('node'+position);
      var range = document.createRange();
      var sel = window.getSelection();
      if (el.childNodes[0]) {
        range.setStart(el.childNodes[0], 0);
        range.setEnd(el.childNodes[0] , el.childNodes[0].length);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    bootstrap();

    $scope.focusNode = focusNode;

    $scope.$watch('currentNote', function(newValue, oldValue) {
      if (newValue) {
        $scope.nodes = newValue.data.nodes;
        if ($scope.nodes[0].textValue === '') {
          $scope.nodes[0].textValue = newValue.data.title;
          $timeout(function() {
            selectNode(0);
          }, 500);
        }
      }
    });

    $scope.removeNode = function(node) {
      console.log('Removing: ' + node.position);
      var nodes = $scope.nodes;
      var pos = node.position;

      var index = _.indexOf(nodes, node);

      nodes.splice(index, 1);

      _.each(nodes, function(n) {
        if (n.position > pos) {
          n.position--;
        }
      });

      
    };

    $scope.levelUp = function($event) {
      $event.preventDefault();
      var i = $scope.currentNode;
      console.log(i);
      var node = getNodeInPos(i);
      if (node.level !== 4){
        node.level++;
      }
    };

    $scope.levelDown = function($event) {
      $event.preventDefault();
      var i = $scope.currentNode;
      var node = getNodeInPos(i);
      if (node.level !== 1) {
        node.level--;
      }
    };

    // $scope.swapUp = function($event) {
    //   $event.preventDefault();
    //   var i = $scope.currentNode;
    //   console.log(i);
    //   var node = getNodeInPos(i);
    //   if (node.level !== 3){
    //     node.level++;
    //   }
    // };

    // $scope.swapDown = function($event) {
    //   $event.preventDefault();
    //   var i = $scope.currentNode;
    //   var node = getNodeInPos(i);
    //   if (node.level !== 1) {
    //     node.level--;
    //   }
    // };

    $scope.addNodeBelow = function(node, newText) {
      var newPostition = node.position + 1;
      
      var newNode = {
          textValue  : newText,
          level       : node.level,
          position    : newPostition,
        };

      var flag = true;
      var lookIn = newPostition;
      var nodeToMove = getNodeInPos(lookIn);

      // move all nodes up in front of new node
      while(flag) {
        if (nodeToMove) {
          lookIn = lookIn + 1;
          var oldNode = nodeToMove;
          nodeToMove = getNodeInPos(lookIn);
          oldNode.position++;
        } else {
          flag = false;
        }
      }

      $scope.nodes.push(newNode);
      $timeout( function() {

        focusNode(newNode.position);
      }, 50);
    };
  });
