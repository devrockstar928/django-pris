/**
* AccountController
* @namespace prism.accounts.controllers
*/
(function () {
  'use strict';

  angular
    .module('prism.accounts.controllers')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$location', '$stateParams', '$rootScope', '$scope', 'Authentication', 'Posts', 'Account', 'Snackbar'];

  /**
  * @namespace AccountController
  */
  function AccountController($location, $stateParams, $rootScope, $scope, Authentication, Posts, Account, Snackbar) {
    var vm = this;

    vm.account = undefined;
    vm.posts = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf prism.accounts.controllers.AccountController
    */
    function activate() {
      var auth_username = Authentication.getAuthenticatedAccount().username;
      var username = $stateParams.username.substr(0);
      var idx;

      $rootScope.currentboard_id = 0;

      Account.get(username).then(accountSuccessFn, accountErrorFn);
      Account.get(auth_username).then(authaccountSuccessFn, authaccountErrorFn);

      /**
      * @name accountSuccessAccount
      * @desc Update `account` on viewmodel
      */
      function accountSuccessFn(data, status, headers, config) {
        vm.account = data.data;
      }


      /**
      * @name accountErrorFn
      * @desc Redirect to index and show error Snackbar
      */
      function accountErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.error('That user does not exist.');
      }

      /**
      * @name authaccountSuccessAccount
      * @desc Update `account` on viewmodel
      */
      function authaccountSuccessFn(data, status, headers, config) {
        vm.auth_account = data.data;
        Posts.get(username).then(postsSuccessFn, postsErrorFn);
      }


      /**
      * @name authaccountErrorFn
      * @desc Redirect to index and show error Snackbar
      */
      function authaccountErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.error('That user does not exist.');
      }


      /**
        * @name postsSucessFn
        * @desc Update `posts` on viewmodel
        */
      function postsSuccessFn(data, status, headers, config) {
        var filtered_data = [];
        for (var i=0; i<data.data.length; i++){
          if (data.data[i].author.username == auth_username) {
            filtered_data.push(data.data[i]);
          } else {
            for (var j = 0; j < data.data[i].subscriber.length; j++) {
              if (data.data[i].subscriber[j] == vm.auth_account.id) {
                filtered_data.push(data.data[i]);
              }
            }
          }
        }
        vm.posts = filtered_data;

      }


      /**
        * @name postsErrorFn
        * @desc Show error snackbar
        */
      function postsErrorFn(data, status, headers, config) {
        Snackbar.error(data.data.error);
      }

      $scope.$on('profile.post.deleted', function (event, post) {
        idx = -1;
        for (var i=0;i<vm.posts.length;i++)
        {
          if (vm.posts[i].id == post.post_id) {
            idx = i;
          }
        }
        vm.posts.splice(idx, 1)
      });

      $scope.$on('profile.deleted.error', function () {
        // vm.posts.shift();
      });
    }
  }
})();