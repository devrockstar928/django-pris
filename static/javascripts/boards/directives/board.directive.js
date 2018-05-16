/**
 * Board
 * @namespace prism.boards.directives
 */
(function () {
  'use strict';

  angular
    .module('prism.boards.directives')
    .directive('board', board);

  /**
   * @namespace Board
   */
  function board() {
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf prism.boards.directives.Board
     */
    var directive = {
      controller: 'BoardController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        board: '=',
        index: '='
      },
      templateUrl: '/static/templates/boards/board.html'
    };

    return directive;
  }
})();