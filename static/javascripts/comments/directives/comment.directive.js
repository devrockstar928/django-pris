/**
 * Post
 * @namespace prism.posts.directives
 */
(function () {
  'use strict';

  angular
    .module('prism.comments.directives')
    .directive('comment', comment);

  /**
   * @namespace Comment
   */
  function comment() {
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf prism.comments.directives.Comment
     */
    var directive = {
      controller: 'CommentController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        comment: '='
      },
      templateUrl: '/static/templates/comments/comment.html'
    };

    return directive;
  }
})();