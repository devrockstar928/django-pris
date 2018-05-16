/**
 * CommentsController
 * @namespace prism.comments.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.comments.controllers')
    .controller('CommentsController', CommentsController)
    .directive('elastic', [
      '$timeout',
      function($timeout) {
        return {
          restrict: 'A',
          link: function($scope, element) {
            var resize = function() {
              var height = element[0].scrollHeight;
              return element[0].style.height = "" + height + "px";
            };
            element.on("blur keyup change", resize);
            $timeout(resize, 0);
          }
        };
      }
    ]);

  CommentsController.$inject = ['$rootScope', '$scope', 'Authentication', 'Comments', 'Snackbar'];

  /**
   * @namespace CommentsController
   */
  function CommentsController($rootScope, $scope, Authentication, Comments, Snackbar) {
    var vm = this;
    var post = $scope.post;

    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.columns = [];
    vm.submit = submit;
    vm.cancel = cancel;
    vm.hasMoreItemsToShow = hasMoreItemsToShow;
    vm.showMoreItems = showMoreItems;
    vm.isCommented = false;
    vm.limit_count = 2;
    vm.more_count = 0;


    activate();

    function activate() {

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

      $scope.$on('comment.created.' + post.id, function (event, comment) {
        comment.comment = comment.comment.replace(/@[a-zA-Z0-9&._-]*/g, make_hotlink);
        comment.comment = comment.comment.replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, insert_target);
        comment.comment = comment.comment.replace(/\n/g, replace_newline);
        vm.columns.push(comment);
      });

      $scope.$on('comment.created.error.' + post.id, function () {
        // vm.columns.shift();
      });

      if (vm.isAuthenticated) {
        Comments.get(post.id).then(commentsSuccessFn, commentsErrorFn);
      }

      /**
       * @name commentsSuccessFn
       * @desc Update thoughts array on view
       */
      function commentsSuccessFn(data, status, headers, config) {
        vm.columns = data.data;
        $scope.$parent.comment_count = data.data.length;
      }


      /**
       * @name commentsErrorFn
       * @desc Show snackbar with error
       */
      function commentsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }

    function submit() {
      vm.isCommented = true;
      Comments.create(vm.comment, post.id).then(createCommentSuccessFn, createCommentErrorFn);


      /**
      * @name createCommentSuccessFn
      * @desc Show snackbar with success message
      */
      function createCommentSuccessFn(data, status, headers, config) {
        Snackbar.show('Success! Comment created.');
        $rootScope.$broadcast('comment.created.' + post.id, {
          comment: data.data.comment,
          author: {
            username: Authentication.getAuthenticatedAccount().username,
            has_gravatar: data.data.author.has_gravatar,
            gravatar_url: data.data.author.gravatar_url
          },
          post: post.id,
          created_at: new Date()
        });
        vm.comment = '';
        vm.isCommented = false;
        $scope.$parent.comment_count = $scope.$parent.comment_count + 1;
      }


      /**
      * @name createCommentErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function createCommentErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('comment.created.error.' + post.id);
        Snackbar.error(data.error);
        vm.isCommented = false;
      }
    }

    function cancel(){
      vm.comment = '';
    }

    function hasMoreItemsToShow(){
      if (vm.columns.length > vm.limit_count){
        return true;
      }
      return false;
    }

    function showMoreItems(){
      vm.limit_count = vm.columns.length;
    }

  }
})();