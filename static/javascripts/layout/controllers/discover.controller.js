  /**
 * DiscoverController
 * @namespace prism.layout.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.layout.controllers')
    .controller('DiscoverController', DiscoverController);

  DiscoverController.$inject = ['$scope', '$rootScope', '$stateParams', 'Authentication', 'Posts', 'Boards', 'Snackbar', 'ngDialog', '$controller'];

  /**
   * @namespace IndexController
   */
  function DiscoverController($scope, $rootScope, $stateParams, Authentication, Posts, Boards, Snackbar, ngDialog, $controller) {
    var vm = this;
    var username  = '';
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.boards = [];

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf prism.layout.controllers.IndexController
     */
    function activate() {
      Boards.get_publicboards().then(boardsSuccessFn, boardsErrorFn);
    }

    /**
     * @name boardsSuccessFn
     */
    function boardsSuccessFn(data, status, headers, config) {
      vm.boards = data.data;
    }

    /**
     * @name boardsErrorFn
     * @desc Show snackbar with error
     */
    function boardsErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }
  }
})();