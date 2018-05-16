/**
 * InviteBoardController
 * @namespace prism.boards.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.boards.controllers')
    .controller('InviteBoardController', InviteBoardController);

  InviteBoardController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Boards'];

  /**
   * @namespace NewPostController
   */
  function InviteBoardController($rootScope, $scope, Authentication, Snackbar, Boards) {

    $scope.username = Authentication.getAuthenticatedAccount().username;
    $scope.isPosted = false;
    $scope.submit = submit;

    $scope.email = '';
    $scope.description = '';

    /**
     * @name submit
     * @desc Invite to the board
     * @memberOf prism.posts.controllers.InviteBoardController
     */
    function submit() {
        if ($scope.email != ''){
            $rootScope.$broadcast('invite.board', {
              email: $scope.email,
              description: $scope.description
            });
            $scope.closeThisDialog();
        } else {
            Snackbar.show('Please input the email to share this board.');
        }
    }
  }
})();