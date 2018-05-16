/**
 * Boards
 * @namespace prism.boards.directives
 */
(function () {
  'use strict';

  angular
    .module('prism.boards.directives')
    .directive('boards', boards);

  /**
   * @namespace Boards
   */
  function boards() {
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf prism.boards.directives.Boards
     */
    var directive = {
      controller: 'BoardsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        boards: '=',
        notLoaded: '=notLoaded'
      },
      templateUrl: '/static/templates/boards/boards.html'
    };

    return directive;
  }
})();