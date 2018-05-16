/**
 * BoardController
 * @namespace prism.boards.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.boards.controllers')
    .controller('BoardController', BoardController);

  BoardController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Boards', 'ngDialog'];

  /**
   * @namespace BoardController
   */
  function BoardController($rootScope, $scope, Authentication, Snackbar, Boards, ngDialog) {
    var vm = this;
    vm.canShowNumber = canShowNumber;
    $scope.board.board_images = [];
    $scope.board.orgs = [];
    $scope.board.url = $scope.board.title.toLowerCase().replace(/\s+/g, '-');
    Boards.get_post($scope.board.id).then(boardPostsSuccessFn, boardPostsErrorFn);


    /**
     * @name boardPostsSuccessFn
     * @desc Update thoughts array on view
     */
    function boardPostsSuccessFn(data, status, headers, config) {
      var length = data.data.length > 4?4:data.data.length;
      for (var i = 0; i < length; i++) {
        var res = data.data[i].image.match(/<img.*?\/>/g);
        if (res.length > 0) {
          $scope.board.board_images.push(res[0]);
        }
      }
    }

    /**
     * @name boardPostsErrorFn
     * @desc Show snackbar with error
     */
    function boardPostsErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
     * @name canShowNumber
     * @desc Determine if the number of subscribers is over 4
     */
    function canShowNumber(){
      if ($scope.board.subscriber.length > 4) {
        return true;
      }
      return false;
    }
  }
})();