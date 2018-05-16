/**
 * Authentication
 * @namespace prism.authentication.services
 */
(function () {
  'use strict';

  angular
    .module('prism.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$window', '$http', 'Snackbar', 'Boards'];

  /**
   * @namespace Authentication
   * @returns {Factory}
   */
  function Authentication($cookies, $window, $http, Snackbar, Boards) {
    /**
     * @name Authentication
     * @desc The Factory to be returned
     */
    var Authentication = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      isSocialAuthenticated: isSocialAuthenticated
    };

    return Authentication;

    ///////////////////

    /**
     * @name getAuthenticatedAccount
     * @desc Return the currently authenticated account
     * @returns {object|undefined} Account if authenticated, else `undefined`
     * @memberOf prism.authentication.services.Authentication
     */
    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
        return;
      }

      var auth_account = JSON.parse($cookies.authenticatedAccount);
      if (auth_account.username == undefined) {
        $cookies.authenticatedAccount = auth_account;
        auth_account = JSON.parse(auth_account);
      }
      return auth_account;

    }


    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     * @memberOf prism.authentication.services.Authentication
     */
    function isAuthenticated() {
      return !!$cookies.authenticatedAccount;
    }


    /**
     * @name isSocialAuthenticated
     * @desc Check if the current user is authenticated by a social provider
     * @returns {boolean} True is user is authenticated by a social provider, else false.
     * @memberOf prism.authentication.services.Authentication
     */
    function isSocialAuthenticated() {
      console.log("COOKIES:", $cookies.social_code, !!$cookies.social_backend);
      return !!$cookies.social_code && !!$cookies.social_backend;
    }

    /**
     * @name login
     * @desc Try to log in with email `email` and password `password`
     * @param {string} email The email entered by the user
     * @param {string} password The password entered by the user
     * @returns {Promise}
     * @memberOf prism.authentication.services.Authentication
     */
    function login(email, password, board, next) {
      board = board || [];
      next = typeof next !== 'undefined' ? next : '/';
      return $http.post('/api/v1/auth/login/', {
        email: email || null,
        password: password || null,
        code: $cookies.social_code || null,
        backend: $cookies.social_backend || null
      }).then(loginSuccessFn, loginErrorFn);

      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and redirect to index
       */
      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);
        if (Object.getOwnPropertyNames(board).length == 1) {
          window.location = next;
        } else {
          Boards.add_user(board.id, email).then(adduserSuccessFn, adduserErrorFn);
        }
      }

      /**
       * @name loginErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function loginErrorFn(data, status, headers, config) {
        Snackbar.error(data.data.message);
        console.error('Epic failure!');
      }

      /**
       * @name adduserSuccessFn
       * @desc Add the logged in user to the board
       */
      function adduserSuccessFn(data, status, headers, config) {
        window.location = '/board/' + board.id;
      }

      /**
       * @name adduserErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function adduserErrorFn(data, status, headers, config) {
        Snackbar.error(data.data.message);
        console.error('Epic failure!');
      }


    }


    /**
     * @name logout
     * @desc Try to log the user out
     * @returns {Promise}
     * @memberOf prism.authentication.services.Authentication
     */
    function logout() {
      return $http.post('/api/v1/auth/logout/', {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      }).then(logoutSuccessFn, logoutErrorFn);

      /**
       * @name logoutSuccessFn
       * @desc Unauthenticate and redirect to index with page reload
       */
      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        window.location = '/';
      }

      /**
       * @name logoutErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function logoutErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }
    }


    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} email The email entered by the user
    * @param {string} password The password entered by the user
    * @param {string} username The username entered by the user
    * @returns {Promise}
    * @memberOf prism.authentication.services.Authentication
    */
    function register(email, password, username, first_name, last_name, company, board) {
      return $http.post('/api/v1/accounts/', {
        'username': username,
        'password': password,
        'email': email,
        'first_name': first_name,
        'last_name': last_name,
        'company': company
      }).then(registerSuccessFn, registerErrorFn);

      /**
      * @name registerSuccessFn
      * @desc Log the new user in
      */
      function registerSuccessFn(data, status, headers, config) {
        Authentication.login(email, password, board);
      }

      /**
      * @name registerErrorFn
      * @desc Log "Epic failure!" to the console
      */
      function registerErrorFn(data, status, headers, config) {
        Snackbar.error(data.data.message);
        console.log('Epic failure!');
      }
    }


    /**
     * @name setAuthenticatedUser
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} account The acount object to be stored
     * @returns {undefined}
     * @memberOf prism.authentication.services.Authentication
     */
    function setAuthenticatedAccount(account) {
      $cookies.authenticatedAccount = JSON.stringify(account);
      var token = account.token;
      var username = account.username;
      if (token && username) {
        $window.localStorage.token = token;
        $window.localStorage.username = username;
      }
    }


    /**
     * @name unauthenticate
     * @desc Delete the cookie where the account object is stored
     * @returns {undefined}
     * @memberOf prism.authentication.services.Authentication
     */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
      delete $cookies.social_code;
      delete $cookies.social_backend;
      $window.localStorage.removeItem('token');
      $window.localStorage.removeItem('username');
    }
  }
})();
