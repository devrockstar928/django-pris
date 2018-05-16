/**
 * Posts
 * @namespace prism.posts.directives
 */
(function () {
  'use strict';

  angular
    .module('prism.comments.directives')
    .directive('comments', comments);

  /**
   * @namespace Comments
   */
  function comments() {
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf prism.comments.directives.Comments
     */
    var directive = {
      controller: 'CommentsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        post: '='
      },
      templateUrl: '/static/templates/comments/comments.html'
    };

    return directive;
  }
})();