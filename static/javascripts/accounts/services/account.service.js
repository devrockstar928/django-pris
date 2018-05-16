/**
 * Account
 * @namespace prism.accounts.services
 */
(function () {
  'use strict';

  angular
    .module('prism.accounts.services')
    .factory('Account', Account);

  Account.$inject = ['$http', '$window'];

  /**
   * @namespace Account
   */
  function Account($http, $window) {
    /**
     * @name Account
     * @desc The factory to be returned
     * @memberOf prism.accounts.services.Account
     */
    var Account = {
      destroy: destroy,
      get: get,
      get_user_from_token: get_user_from_token,
      update: update
    };

    return Account;

    /////////////////////

    /**
     * @name destroy
     * @desc Destroys the account with username `username`
     * @param {string} username The username of the account to be destroyed
     * @returns {Promise}
     * @memberOf prism.accounts.services.Account
     */
    function destroy(username) {
      return $http.delete('/api/v1/accounts/' + username + '/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name get
     * @desc Gets the account with username `username`
     * @param {string} username The username of the account to get
     * @returns {Promise}
     * @memberOf prism.accounts.services.Account
     */
    function get(username) {
      return $http.get('/api/v1/accounts/' + username + '/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name get
     * @desc Gets the user from token
     * @returns {Promise}
     * @memberOf prism.accounts.services.Account
     */
    function get_user_from_token() {
      return $http.get('/api/account/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name update
     * @desc Update the account with username `username`
     * @param {string} username The username of the account to be updated
     * @param {Object} account The updated account model
     * @returns {Promise}
     * @memberOf prism.accounts.services.Account
     */
    function update(username, account) {
      return $http.put('/api/v1/accounts/' + username + '/', account, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }
  }
})();