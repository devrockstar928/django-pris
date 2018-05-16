/**
 * Register controller
 * @namespace prism.authentication.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$rootScope', '$scope', '$stateParams', 'Authentication', 'Boards'];

  /**
   * @namespace RegisterController
   */
  function RegisterController($location, $rootScope, $scope, $stateParams, Authentication, Boards) {
    var vm = this;

    vm.register = register;
    vm.socialLogin = socialLogin;
    vm.salt = '';
    vm.board = [];

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf prism.authentication.controllers.RegisterController
     */
    function activate() {
      $rootScope.currentboard_id = 0;
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      } else {
        if ($stateParams.salt) {
          vm.salt = $stateParams.salt;
          Boards.get_user(vm.salt).then(userSuccessFn, userErrorFn);
        }
      }
    }

    /**
     * @name userSuccessFn
     * @desc Update thoughts array on view
     */
    function userSuccessFn(data, status, headers, config) {
      vm.email = data.data[0].email;
      vm.board = data.data[0].board;
    }


    /**
     * @name userErrorFn
     * @desc Show snackbar with error
     */
    function userErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
     * @name register
     * @desc Register a new user
     * @memberOf prism.authentication.controllers.RegisterController
     */
    function register() {
        
      /* Segment Tracking Event */
      analytics.track('Sign Up', {
            plan: 'Free'
      });
        
      Authentication.register(vm.email, vm.password, vm.username, vm.first_name, vm.last_name, vm.company, vm.board);
    }

    /**
     * @name socialLogin
     * @desc Initiates social authentication
     * @returns {undefined}
     * @memberOf prism.authentication.services.Authentication
     */
    function socialLogin($event, backend) {
      $event.preventDefault();
      $event.stopPropagation();
      location.href = '/login/' + backend + '/';
    }
  }
})();
