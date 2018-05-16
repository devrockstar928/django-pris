 /**
 * IndexController
 * @namespace prism.layout.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.layout.controllers')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$rootScope', '$stateParams', 'Authentication', 'Snackbar', 'ngDialog', '$controller'];

  /**
   * @namespace HomeController
   */
  function HomeController($scope, $rootScope, $stateParams, Authentication, Snackbar, ngDialog, $controller) {
    var vm = this;
    $scope.state = 'a';

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf prism.layout.controllers.HomeController
     */
    function activate() {

    }
  }
})();