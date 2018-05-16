/**
 * Posts
 * @namespace prism.posts.directives
 */
(function () {
  'use strict';

  angular
    .module('prism.posts.directives')
    .directive('posts', posts);

  /**
   * @namespace Posts
   */
  function posts() {
    /**
     * @name directive
     * @desc The directive to be returned
     * @memberOf prism.posts.directives.Posts
     */
    var directive = {
      controller: 'PostsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        posts: '=',
        notLoaded: '=notLoaded'
      },
      templateUrl: '/static/templates/posts/posts.html'
    };

    return directive;
  }
})();