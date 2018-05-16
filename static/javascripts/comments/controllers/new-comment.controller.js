/**
 * NewCommentController
 * @namespace prism.comments.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.comments.controllers')
    .controller('NewCommentController', NewCommentController);

  NewCommentController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Comments'];

  /**
   * @namespace NewPostController
   */
  function NewCommentController($rootScope, $scope, Authentication, Snackbar, Comments) {
    var vm = this;

    vm.submit = submit;

    /**
     * @name submit
     * @desc Create a new Comment
     * @memberOf prism.comments.controllers.NewCommentController
     */
    function submit() {
      Comments.create(vm.comment).then(createCommentSuccessFn, createCommentErrorFn);


      /**
       * @name createCommentSuccessFn
       * @desc Show snackbar with success message
       */
      function createCommentSuccessFn(data, status, headers, config) {
        $rootScope.$broadcast('comment.created', {
          comment: data.data.comment,
          author: {
            username: Authentication.getAuthenticatedAccount().username
          }
        });

        $scope.closeThisDialog();
        Snackbar.show('Success! Comment created.');
      }


      /**
       * @name createCommentErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function createCommentErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('comment.created.error');
        Snackbar.error(data.error);
      }
    }
  }
})();