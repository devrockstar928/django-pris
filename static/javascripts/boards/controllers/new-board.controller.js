/**
 * NewBoardController
 * @namespace prism.boards.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.boards.controllers')
    .controller('NewBoardController', NewBoardController);

  NewBoardController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Boards'];

  /**
   * @namespace NewPostController
   */
  function NewBoardController($rootScope, $scope, Authentication, Snackbar, Boards) {
    var vm = this;
    $scope.username = Authentication.getAuthenticatedAccount().username;

    $scope.isPosted = false;
    $scope.submit = submit;
    $scope.changeBoardType = changeBoardType;
    $scope.board_type = 'Private';


    /**
     * @name changeBoardType
     * @desc change board type (public/private)
     */
    function changeBoardType(){
      if ($scope.board_type == 'Private'){
        $scope.board_type = 'Public';
      } else {
        $scope.board_type = 'Private';
      }
    }

    /**
     * @name submit
     * @desc Create a new Post
     * @memberOf prism.posts.controllers.NewPostController
     */
    function submit() {
      if ($scope.title == ''){
        Snackbar.show('Title must not be empty!');
      } else {
        $scope.isPosted = true;
        Boards.create($scope.title, $scope.description, $scope.email, $scope.board_type).then(createBoardSuccessFn, createBoardErrorFn);
      }


      /**
       * @name createBoardSuccessFn
       * @desc Show snackbar with success message
       */
      function createBoardSuccessFn(data, status, headers, config) {

        var is_share = data.data.invited_users.length > 1 ? 1:0;
        $rootScope.$broadcast('board.created', {
          title: data.data.title,
          description: data.data.description,
          url: data.data.title.toLowerCase().replace(/\s+/g, '-'),
          username: $scope.username,
          id: data.data.id,
          is_share: is_share
        });

        $scope.isPosted = false;
        $scope.closeThisDialog();
        //setTimeout(function(){$(".board" + data.data.id).trigger('click');}, 500);
        Snackbar.show('Success! Board created.');

        if ($scope.flag != undefined) {
          window.location = '/board/' + data.data.id;
        }
      }


      /**
       * @name createBoardErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function createBoardErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('board.created.error');
        Snackbar.error(data.error);
        $scope.isPosted = false;
      }
    }
  }
})();