/**
 * PostController
 * @namespace prism.posts.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.posts.controllers')
    .controller('PostController', PostController);

  PostController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Posts', 'ngDialog'];

  /**
   * @namespace PostController
   */
  function PostController($rootScope, $scope, Authentication, Snackbar, Posts, ngDialog) {
    var vm = this;

    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.submit = submit;
    vm.edit = edit;
    vm.like_unlike = like_unlike;
    vm.post_id = 0;
    $scope.comment_count = 0;
    $scope.like_count = 0;
    $scope.like_id = 0;
    $scope.is_liked = false;
    $scope.username = '';

    if (vm.isAuthenticated) {
      $scope.username = Authentication.getAuthenticatedAccount().username;
      Posts.get_like($scope.post.id).then(getLikeSuccessFn, getLikeErrorFn);
    }

    /**
     * @name getLikeSuccessFn
     * @desc Show snackbar with success message
     */
    function getLikeSuccessFn(data, status, headers, config) {
      $scope.like_count = data.data.length;
      for (var i=0; i<data.data.length; i++) {
        if (data.data[i].post.id == $scope.post.id) {
          if ($scope.username == data.data[i].author.username) {
            $scope.like_id = data.data[i].id;
            $scope.is_liked = true;
            $(".action-fav-" + $scope.post.id + "").addClass('liked');
          }
        }
      }
    }


    /**
     * @name getLikeErrorFn
     * @desc Propogate error event and show snackbar with error message
     */
    function getLikeErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }


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

    $scope.post.description = $scope.post.description.replace(/@\w+/g, make_hotlink);
    $scope.post.description = $scope.post.description.replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, insert_target);
    $scope.post.content = '';
    if ($scope.post.title != null) {
      $scope.post.content  = $scope.post.content + $scope.post.title;
    }
    if ($scope.post.image != null) {
      $scope.post.content = $scope.post.content + $scope.post.image;
    }
    $scope.post.content = $scope.post.content + $scope.post.description;
    if ($scope.post.board.length >= 1) {
      $scope.post.board_title = $scope.post.board[0].title;
      $scope.post.board_url = '/board/' + $scope.post.board[0].author.username + '/' + $scope.post.board[0].title.toLowerCase().replace(/\s+/g, '-');
    }


    /**
     * @name edit
     * @param id The id of the post
     * @memberOf prism.posts.controllers.PostController
     */
    function edit(id){
      //$rootScope.$broadcast('post.edit', {
      //  post_id: id
      //});
      ngDialog.open({
        templateUrl: '/static/templates/posts/new-post.html',
        controller:'NewPostController',
        controllerAs: 'vm',
      });
    }

    /**
     * @name submit
     * @desc Delete a new Post
     * @memberOf prism.posts.controllers.PostController
     */
    function submit(id) {

      Posts.delete(id).then(deletePostSuccessFn, deletePostErrorFn);
      vm.post_id = id;

      /**
       * @name deletePostSuccessFn
       * @desc Show snackbar with success message
       */
      function deletePostSuccessFn(data, status, headers, config) {
        $rootScope.$broadcast('post.deleted', {
          post_id: vm.post_id
        });

        Snackbar.show('Success! Post deleted.');
      }


      /**
       * @name deletePostErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function deletePostErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('post.deleted.error');
        if (data.status == 403) {
          Snackbar.error(data.data.detail);
        } else {
          Snackbar.error(data.error);
        }
      }
    }

    /**
     * @name like
     * @desc Add like to post
     * @memberOf prism.posts.controllers.PostController
     */
    function like_unlike(id) {
      if ($scope.is_liked == true){
        Posts.unlike($scope.like_id).then(unlikeSuccessFn, unlikeErrorFn);
      } else {
        Posts.like(id).then(likeSuccessFn, likeErrorFn);
      }

      vm.post_id = id;

      /**
       * @name likeSuccessFn
       * @desc Show snackbar with success message
       */
      function likeSuccessFn(data, status, headers, config) {
        $scope.is_liked = true;
        $scope.like_id = data.data.id;
        $scope.like_count = $scope.like_count + 1;
        $(".action-fav-" + $scope.post.id + "").addClass('liked');
        Snackbar.show('Success: Upvoted!');
      }


      /**
       * @name likeErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function likeErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('post.like.error');
        Snackbar.error(data.error);
      }

      /**
       * @name unlikeSuccessFn
       * @desc Show snackbar with success message
       */
      function unlikeSuccessFn(data, status, headers, config) {
        $scope.is_liked = false;
        $scope.like_count = $scope.like_count - 1;
        $(".action-fav-" + $scope.post.id + "").removeClass('liked');
        Snackbar.show('Success: Unvoted!');
      }


      /**
       * @name likeErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function unlikeErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('post.unlike.error');
        Snackbar.error(data.error);
      }
    }
  }
})();