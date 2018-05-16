/**
 * AccountSettingsController
 * @namespace prism.accounts.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.accounts.controllers')
    .controller('AccountSettingsController', AccountSettingsController);

  AccountSettingsController.$inject = [
    '$location', '$stateParams', '$rootScope', 'Authentication', 'Account', 'Snackbar'
  ];

  /**
   * @namespace AccountSettingsController
   */
  function AccountSettingsController($location, $stateParams, $rootScope, Authentication, Account, Snackbar) {
    var vm = this;

    vm.destroy = destroy;
    vm.update = update;

    activate();


    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated.
     * @memberOf prism.accounts.controllers.AccountSettingsController
     */
    function activate() {
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      var username = $stateParams.username.substr(0);

      $rootScope.currentboard_id = 0;
      // Redirect if not logged in
      if (!authenticatedAccount) {
        $location.url('/');
        Snackbar.error('You are not authorized to view this page.');
      } else {
        // Redirect if logged in, but not the owner of this account.
        if (authenticatedAccount.username !== username) {
          debugger;
          $location.url('/');
          Snackbar.error('You are not authorized to view this page.');
        }
      }

      Account.get(username).then(accountSuccessFn, accountErrorFn);

      /**
       * @name accountSuccessFn
       * @desc Update `account` for view
       */
      function accountSuccessFn(data, status, headers, config) {
        vm.account = data.data;
      }

      /**
       * @name accountErrorFn
       * @desc Redirect to index
       */
      function accountErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.error('That user does not exist.');
      }
    }


    /**
     * @name destroy
     * @desc Destroy this account
     * @memberOf prism.accounts.controllers.AccountSettingsController
     */
    function destroy() {
      Account.destroy(vm.account.username).then(accountSuccessFn, accountErrorFn);

      /**
       * @name accountSuccessFn
       * @desc Redirect to index and display success snackbar
       */
      function accountSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();
        window.location = '/';

        Snackbar.show('Your account has been deleted.');
      }


      /**
       * @name accountErrorFn
       * @desc Display error snackbar
       */
      function accountErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }


    /**
     * @name update
     * @desc Update this account
     * @memberOf prism.accounts.controllers.AccountSettingsController
     */
    function update() {
      var username = $stateParams.username.substr(0);

      Account.update(username, vm.account).then(accountSuccessFn, accountErrorFn);

      /**
       * @name accountSuccessFn
       * @desc Show success snackbar
       */
      function accountSuccessFn(data, status, headers, config) {
        Snackbar.show('Your account has been updated.');
      }


      /**
       * @name accountErrorFn
       * @desc Show error snackbar
       */
      function accountErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
  }
})();