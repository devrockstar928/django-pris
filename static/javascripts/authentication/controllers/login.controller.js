/**
* LoginController
* @namespace prism.authentication.controllers
*/
(function () {
  'use static';

  angular
    .module('prism.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$rootScope', '$stateParams', '$scope', 'Authentication'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $rootScope, $stateParams, $scope, Authentication) {
    var vm = this;

    vm.login = login;
    vm.forgot_password = forgot_password;
    vm.socialLogin = socialLogin;
    vm.next = '/';
    if ($location.search().next != undefined) {
      vm.next = $location.search().next;
    }

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf prism.authentication.controllers.LoginController
    */
    function activate() {
      $rootScope.currentboard_id = 0;
      // If the user is authenticated, they should not be here.
      if (Authentication.isSocialAuthenticated()) {
        Authentication.login().then(function () {
          $location.url(vm.next);
        });
      } else if (Authentication.isAuthenticated()) {
        $location.url(vm.next);
      }
    }

    /**
    * @name login
    * @desc Log the user in
    * @memberOf prism.authentication.controllers.LoginController
    */
    function login() {
      Authentication.login(vm.email, vm.password, [], vm.next);
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

    /**
     * @name forgot_password
     * @returns {undefined}
     * @memberOf prism.authentication.services.Authentication
     */
    function forgot_password(){
      location.href = '/recover/';
    }
  }
})();
