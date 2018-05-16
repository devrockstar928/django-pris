/**
 * BoardsController
 * @namespace prism.boards.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.boards.controllers')
    .controller('BoardsController', BoardsController);

  BoardsController.$inject = ['$scope', 'ngDialog'];

  /**
   * @namespace BoardsController
   */
  function BoardsController($scope, ngDialog) {
    var vm = this;
    vm.columns = [];
    vm.calculateNumberOfColumns = calculateNumberOfColumns;
    vm.create_board = create_board;

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf prism.boards.controllers.BoardsController
     */
    function activate() {
      $scope.$watchCollection(function () {
        if ($scope.boards && $scope.boards.length > 0) {
          $scope.notLoaded = true;
        } else {
          $scope.notLoaded = false;
        }
        return $scope.boards;
      }, render);
      //$scope.$watch(function () { return $(window).width(); }, render);
    }

        /**
     * @name create_board
     * @desc Create New Board
     * @memberOf prism.layout.controllers.NavbarController
     */
    function create_board() {
      var dialog = ngDialog.open({
        templateUrl: '/static/templates/boards/new-board.html',
        controller:'NewBoardController',
        controllerAs: 'vm',
        scope: $scope,
        //preCloseCallback: function(value) {
        //  var nestedConfirmDialog = ngDialog.openConfirm({
        //      template:'\
        //          <p>Are you sure you want to close the parent dialog?</p>\
        //          <div class="ngdialog-buttons">\
        //              <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
        //              <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
        //          </div>',
        //      plain: true
        //  });
        //
        //  // NOTE: return the promise from openConfirm
        //  return nestedConfirmDialog;
        //}
      });
      dialog.closePromise.then(function (data) {
          console.log(data);
      });
    }


    /**
     * @name calculateNumberOfColumns
     * @desc Calculate number of columns based on screen width
     * @returns {Number} The number of columns containing Boards
     * @memberOf prism.boards.controllers.BoardsControllers
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
     * @memberOf prism.boards.controllers.BoardsController
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
          if (element.description){
            return element.title.length + element.description.length;
          }
          return element.title.length;
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
     * @desc Renders Boards into columns of approximately equal height
     * @param {Array} current The current value of `vm.boards`
     * @param {Array} original The value of `vm.boards` before it was updated
     * @memberOf prism.boards.controllers.BoardsController
     */
    function render(current, original) {
      if (current !== original) {
        vm.columns = [];

        for (var i = 0; i < calculateNumberOfColumns(); ++i) {
          vm.columns.push([]);
        }

        for (var i = 0; i < current.length; ++i) {
          var column = approximateShortestColumn();

          vm.columns[column].push(current[i]);
        }
      }
    }
  }

})();