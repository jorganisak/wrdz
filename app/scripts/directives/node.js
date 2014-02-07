'use strict';

// It is very possible that this directive does not require isolated scope.
// You should consider refactoring everything to see if this is true.

angular.module('wrdz')
  .directive('node', function ($timeout, $q, $rootScope) {
    return {
      templateUrl: 'partials/node',
      restrict: 'E',
      require: 'ngModel',
      replace: true,
      scope: {
        value : '=value',
        addNodeBelow : '&addNodeBelow',
        currentNode  : '=currentNode',
        focusNode    : '&focusNode',
        nodes        : '=nodes',
        updateNote   : '&updateNote',
        currentNote  : '=currentNote',
        removeNode   : '&removeNode'

      },
      link: function postLink(scope, element, attrs, ctrl) {
        //function returns string after current caret position
        // and replaces current text with sliced front
        //get inner text
        function getInnerText() {
            return element[0].innerText.trim();
          };

        //get caret position in textarea

        function getCaret() {
            // return document.getElementById('node'+scope.value.position).selectionStart;
            return document.getSelection().extentOffset;
          };

          //get length of textarea
        function getLength() {
            return getInnerText().length;
          };

        function textAfterPos() {
            var val = getInnerText();
            var start = getCaret();
            var back = val.slice(start);
            var front = val.slice(0, start);
            if (!front) {
              scope.value.textValue = '';
            } else {
              document.getElementById('node'+scope.value.position).innerText = front;
            }
            return back;
          };

        function getSelectionHtml() {
          var html = "";
          if (typeof window.getSelection !== "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
              var container = document.createElement("div");
              for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
              }
              html = container.innerHTML;
            }
          } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
              html = document.selection.createRange().htmlText;
            }
          }
          return html;
        }


        function setInnerText(text) {
          element[0].innerText = getInnerText() + text;
        }

        function setCaret(node, pos) {
          var el = document.getElementById('node' + node);
          var range = document.createRange();
          var sel = window.getSelection();
          if (el.childNodes[0] && pos) {
            range.setStart(el.childNodes[0], pos);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }

        function getNode(position) {
          return _.find(scope.nodes, function(node) {
            if (String(node.position) === String(position)) {
              return node;
            }
          });

        }

        function isEmpty() {
          return getInnerText() === '';
        }

        function setCaretToEndWithTimeout(position) {
          var node = getNode(position);
          if (node.textValue !== ''){
            $timeout(function() {
              setCaret(position, node.textValue.length);
            }, 10);
          }
        }
        ///////////////
        function read() {
          var defer = $q.defer();
          var html = element.html();
          ctrl.$setViewValue(html);
          defer.resolve();
          return defer.promise;
        }
        ctrl.$render = function() {
          var id = element[0].id;
          if (!element.hasClass("Medium")) {
            var editor = new Medium({
              element: document.getElementById(id),
              mode: 'inline',
              debug: true
            });
          }
          element.html(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
          read().then(function() {
            // scope.focusNode({position: element[0].id});
          });
        };      
        element.on('blur keyup change focus', function() {
          $timeout(function(){
            read();
          }, 5);
        });

        scope.keypress = function(evt) {
          $timeout(function() {
            scope.updateNote();
          }, 10);
       
        };



        //keypress functions
        scope.keydown = function(evt) {

          // console.log(evt)
            
          // Update is timed out to match timeout above in model update.
          // This could fit into keypress or keydown.
          // $timeout(function() {
          //   scope.updateNote();
          // }, 10);

          //new note shortcut
          if (evt.keyCode === 75) {
            if (evt.ctrlKey || evt.metaKey) {
              evt.preventDefault();
              evt.stopPropagation();
              console.log('new note should be made!');
              scope.$emit('makeNewNote');
            }
          }



          //enter press creates new node below 
          //need to let this break node text if caret
          //is not at the end of the node
          if (evt.keyCode === 13) {
            evt.preventDefault();
            var newText = textAfterPos();
            scope.addNodeBelow({node: scope.value, newText: newText});
          }

          //arrow up and caret is at beginning of node
          if (evt.keyCode === 38 ) {
            if (evt.ctrlKey || evt.metaKey) {
              evt.stopPropagation();
              scope.$emit('noteChangeUp', evt);
            }
            if (getCaret() === 0) {
              if (String(scope.currentNode) !== '0') {
                var newPos = scope.value.position - 1;
                scope.focusNode({position: newPos});
                //setCaretToEndWithTimeout(newPos);
              }
              
            }
          }

          //arrow down and caret is at end of node
          if (evt.keyCode === 40){
            if (evt.ctrlKey || evt.metaKey) {
              evt.stopPropagation();
              scope.$emit('noteChangeDown');
            }
            if (getCaret() === getLength() || getLength() === 0) {
              if (String(scope.currentNode) !== String(scope.nodes.length-1)) {
                var newPosDown = scope.value.position + 1;
                scope.focusNode({position: newPosDown});
                // setCaretToEndWithTimeout(newPosDown);
              }
            }
          }
           
          // tab forward
          // to go back to four levels, just change this max here..and the one in the node ctrl
          if (evt.keyCode === 9 && !evt.shiftKey) {
            if (scope.value.level !== 4) {
              scope.value.level++;
            }
            evt.preventDefault();
          }

          //tab back
          if (evt.keyCode === 9 && evt.shiftKey) {
            if (scope.value.level !== 1) {
              scope.value.level--;
            }
            evt.preventDefault();
          }

          //backspace
          if (evt.keyCode === 8 && getCaret() === 0 && scope.value.position !== 0) {
            var nodeAbove = getNode(scope.value.position - 1);
            if (isEmpty()) {
              scope.focusNode({position: nodeAbove.position});
              scope.removeNode({node: scope.value});
              setCaretToEndWithTimeout(nodeAbove.position);
              evt.preventDefault();

            } else {
              var selection = getSelectionHtml();
              if (!selection) {
                var text = textAfterPos();
                var startingLength = nodeAbove.textValue.length;
                nodeAbove.textValue = nodeAbove.textValue + text;

                scope.removeNode({node: scope.value});
                $timeout(function() {
                  setCaret(nodeAbove.position, startingLength);
                }, 1);
                evt.preventDefault();
              }
            }
          }

          // delete key ... first stab at this failed...
          if (evt.keyCode === 46 && getCaret() === getLength() && scope.value.position !== scope.nodes.length) {
            var nodeBelow = getNode(scope.value.position + 1);
            var startingLengthDel = getLength();
            if (nodeBelow) {
              scope.value.textValue = scope.value.textValue + nodeBelow.textValue;
              scope.removeNode({node: nodeBelow});

              $timeout(function() {
                setCaret(scope.value.position, startingLengthDel);
              }, 1);
              evt.preventDefault();
            }
          }

        };

        ////////////////

        //to be called when element is focused
        scope.click = function() {
          scope.focusNode({position: scope.value.position});
        };


        // watches for nodes[] changes and sets Caret to end of node
        // automatically last node is the one that it goes to 

        scope.$on('noteSwitch', function(evt, note) {
          var nodes = note.data.nodes;
          $timeout(function() {
            scope.focusNode({position: nodes.length -1 });
            if (nodes.length -1 === scope.value.position) {
              setCaret(nodes.length -1 , getLength() );
            }
          }, 300);
        });

        scope.$watch('value.level', function(newValue, oldValue) {
          if (newValue) {
            scope.level = 'level' + newValue;
            $rootScope.$broadcast('levelChange', scope.value.level);
          }
        });


      }
    };
  });
