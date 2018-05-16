/**
 * PostsController
 * @namespace prism.posts.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.posts.controllers')
    .controller('PostsController', PostsController)
    .config(config);

  config.$inject = ['$provide', 'flowFactoryProvider'];
  function config($provide, flowFactoryProvider) {
    flowFactoryProvider.defaults = {
      target: '',
      permanentErrors: [404, 500, 501],
      maxChunkRetries: 1,
      chunkRetryInterval: 5000,
      simultaneousUploads: 10
    };
    flowFactoryProvider.on('catchAll', function (event) {
      console.log('catchAll', arguments);
    });
    // Can be used with different implementations of Flow.js
    flowFactoryProvider.factory = fustyFlowFactory;

    $provide.decorator('taOptions', ['taRegisterTool', 'taTranslations', '$modal', '$delegate',
      function(taRegisterTool, taTranslations, $modal, taOptions) {
        // $delegate is the taOptions we are decorating
        // here we override the default toolbars specified in taOptions.
        taOptions.toolbar = [
          ['html', 'insertImage', 'insertLink', 'insertVideo'],
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'],
          ['bold', 'italics', 'underline', 'ul', 'ol', 'undo', 'redo', 'clear'],
          ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent']
        ];

        taOptions.classes = {
          focussed: 'focussed',
          toolbar: 'btn-toolbar',
          toolbarGroup: 'btn-group',
          toolbarButton: 'btn btn-default',
          toolbarButtonActive: 'active',
          disabled: 'disabled',
          textEditor: 'form-control',
          htmlEditor: 'form-control'
        };

        // Create our own insertImage button
        taRegisterTool('customInsertImage', {
          iconclass: "fa fa-picture-o",
          action: function($deferred) {
            var textAngular = this;
            var savedSelection = rangy.saveSelection();
            var modalInstance = $modal.open({
              // Put a link to your template here or whatever
              template: '<label>Enter the url to your image:</label><input type="text" ng-model="img.url"><button ng-click="submit()">OK</button>',
              size: 'sm',
              controller: ['$modalInstance', '$scope',
                function($modalInstance, $scope) {
                  $scope.img = {
                    url: ''
                  };
                  $scope.submit = function() {
                    $modalInstance.close($scope.img.url);
                  };
                }
              ]
            });

            modalInstance.result.then(function(imgUrl) {
              rangy.restoreSelection(savedSelection);
              textAngular.$editor().wrapSelection('insertImage', imgUrl);
              $deferred.resolve();
            });
            return false;
          }
        });

        taRegisterTool('toggle', {
          buttontext: 'A',
          tooltiptext: 'Toggle Options below',
          isDisabled: function(){
            return true;
          },
          action: function() {
          }
        });
        // Now add the button to the default toolbar definition
        // Note: It'll be the last button
        taOptions.toolbar[3].push('customInsertImage');
        taOptions.toolbar[0].splice(1, 0, 'toggle');
        return taOptions;
      }
    ]);
  }

  PostsController.$inject = ['$scope', 'ngDialog'];

  /**
   * @namespace PostsController
   */
  function PostsController($scope, ngDialog) {
    var vm = this;

    vm.columns = [];
    vm.scroll_columns = [];
    $scope.loadMore = loadMore;

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf prism.posts.controllers.PostsController
     */
    function activate() {
      // just a hack to adjust navbar height on baord pages
      //$('.navbar').css({'height': $('.navbar').height() });
      //alert ($('.navbar').height());

      $scope.$watchCollection(function () {
        if ($scope.posts && $scope.posts.length > 0) {
          $scope.notLoaded = true;
        } else {
          $scope.notLoaded = false;
        }
        return $scope.posts;
      }, render);
      //$scope.$watch(function () { return $(window).width(); }, render);
    }
    

    /**
     * @name calculateNumberOfColumns
     * @desc Calculate number of columns based on screen width
     * @returns {Number} The number of columns containing Posts
     * @memberOf prism.posts.controllers.PostsControllers
     */
    function calculateNumberOfColumns() {
      var width = $(window).width();

      if (width >= 1200) {
        return 4;
      } else if (width >= 992) {
        return 3;
      } else if (width >= 768) {
        return 2;
      } else {
        return 1;
      }
    }


    /**
     * @name approximateShortestColumn
     * @desc An algorithm for approximating which column is shortest
     * @returns The index of the shortest column
     * @memberOf prism.posts.controllers.PostsController
     */
    function approximateShortestColumn() {
      var scores = vm.columns.map(columnMapFn);

      return scores.indexOf(Math.min.apply(this, scores));

      
      /**
       * @name columnMapFn
       * @desc A map function for scoring column heights
       * @returns The approximately normalized height of a given column
       */
      function columnMapFn(column) {
        var lengths = column.map(function (element) {
          var length = 0;
          if (element.length == 0){
            return 200;
          }
          if (element.image == null){
            length = length + 0;
          } else {
            length = length + element.image.length / 3;
          }
          return length + Math.ceil(element.description.length / 50) * 25;

        });

        return lengths.reduce(sum, 0) * column.length;
      }


      /**
       * @name sum
       * @desc Sums two numbers
       * @params {Number} m The first number to be summed
       * @params {Number} n The second number to be summed
       * @returns The sum of two numbers
       */
      function sum(m, n) {
        return m + n;
      }
    }


    /**
     * @name render
     * @desc Renders Posts into columns of approximately equal height
     * @param {Array} current The current value of `vm.posts`
     * @param {Array} original The value of `vm.posts` before it was updated
     * @memberOf prism.posts.controllers.PostsController
     */
    function render(current, original) {
      if (current !== original) {
        vm.columns = [];
        vm.scroll_columns = [];

        for (var i = 0; i < calculateNumberOfColumns(); ++i) {
          vm.columns.push([]);
          vm.scroll_columns.push([]);
        }

        var column = approximateShortestColumn();
        vm.columns[column].push([]);
        for (var i = 0; i < current.length; ++i) {
          column = approximateShortestColumn();

          vm.columns[column].push(current[i]);
        }

        for (var i = 0; i < 5; ++i) {
          for (var j = 0; j < calculateNumberOfColumns(); ++j) {
            if (vm.columns[j][i] != undefined) {
              vm.scroll_columns[j].push(vm.columns[j][i]);
            }
          }
        }
      }
    }

    function loadMore() {
      if (vm.scroll_columns.length > 0) {
        var last = 0;
        for (var j = 0; j < calculateNumberOfColumns(); ++j) {
          last = vm.scroll_columns[j].length - 1;
          for (var i = 1; i < 2; i++) {
            if (vm.columns[j][last + i] != undefined) {
              vm.scroll_columns[j].push(vm.columns[j][last + i]);
            }
          }
        }
      }
    }


    $scope.callme = function () {
      console.log('--file selected--', $scope.obj.flowObject);
      ngDialog.open({
        templateUrl: '/static/templates/posts/new-post.html',
        controller:'NewPostController',
        controllerAs: 'vm',
        scope: $scope
      });
    };
    $scope.obj = {};
    $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {

    });
  }

})();