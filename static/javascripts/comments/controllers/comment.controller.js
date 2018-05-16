/**
 * CommentController
 * @namespace prism.comments.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.comments.controllers')
    .controller('CommentController', CommentController);

  CommentController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Comments'];

  /**
   * @namespace CommentController
   */
  function CommentController($rootScope, $scope, Snackbar, Comments) {

    function make_hotlink(p1){
      return '<a href="/+' + p1.substring(1) +  '">' + p1.substring(1) + '</a>';
    }

    function remove_target(pl){
      return '';
    }

    function add_target(pl){
      return 'target="_blank" ' + pl;
    }

    function insert_target(pl){
      pl = pl.replace(/target="\w+"/g, remove_target);
      pl = pl.replace(/href/g, add_target);
      return pl;
    }

    function replace_newline(pl) {
      return '<br/>';
    }

    $scope.comment.comment = $scope.comment.comment.replace(/@[a-zA-Z0-9&._-]*/g, make_hotlink);
    $scope.comment.comment = $scope.comment.comment.replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, insert_target);
    $scope.comment.comment = $scope.comment.comment.replace(/\n/g, replace_newline);
  }
})();