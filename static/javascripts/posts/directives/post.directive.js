/**
 * Post
 * @namespace prism.posts.directives
 */
(function () {
  'use strict';

  angular
    .module('prism.posts.directives')
    .directive('post', post);

  /**
   * @namespace Post
   */
  function post() {
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf prism.posts.directives.Post
     */
    var directive = {
      controller: 'PostController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        post: '='
      },
      templateUrl: '/static/templates/posts/post.html'
    };

    return directive;
  }
})();