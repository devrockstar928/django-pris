/**
 * NavbarController
 * @namespace prism.layout.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.layout.controllers')
    .controller('HomeNavbarController', HomeNavbarController);

  HomeNavbarController.$inject = ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Snackbar'];


  /**
   * @namespace NavbarController
   */
  function HomeNavbarController($scope, $rootScope, $stateParams, $location, Authentication, Snackbar) {
    var vm = this;
    vm.isAuthenticated = Authentication.isAuthenticated();

    activate();

    function activate() {
      if (vm.isAuthenticated) {

      }
    }

  }
})();