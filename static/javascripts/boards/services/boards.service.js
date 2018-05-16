/**
 * Boards
 * @namespace prism.boards.services
 */
(function () {
  'use strict';

  angular
    .module('prism.boards.services')
    .factory('Boards', Boards);

  Boards.$inject = ['$http', '$window'];

  /**
   * @namespace Boards
   * @returns {Factory}
   */
  function Boards($http, $window) {
    var Boards = {
      all: all,
      get_orgs: get_orgs,
      get_boards: get_boards,
      create: create,
      create_board: create_board,
      get_post: get_post,
      get_board: get_board,
      get_public_board: get_public_board,
      is_private: is_private,
      invite: invite,
      get_user: get_user,
      add_user: add_user,
      unfollow: unfollow,
      follow: follow,
      get_allboards: get_allboards,
      get_myboards: get_myboards,
      get_companyboards: get_companyboards,
      get_privateboards: get_privateboards,
      get_publicboards: get_publicboards
    };

    return Boards;

    ////////////////////

    /**
     * @name all
     * @desc Get all Boards
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function all() {
      return $http.get('/api/v1/boards/', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name create_board
     * @desc Create New Board
     * @memberOf prism.layout.controllers.NavbarController
     */
    function create_board() {
      var dialog = ngDialog.open({
        templateUrl: '/static/templates/boards/new-board.html'
      });
      dialog.closePromise.then(function (data) {
          console.log(data);
      });
    }

    /**
     * @name create
     * @desc Create a new Boards
     * @param {string} content The content of the new Board
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function create(title, description, email, board_type) {
      return $http.post('/api/v1/boards/',{
        'title': title,
        'description': description,
        'subscriber': email,
        'board_type': board_type
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name get_orgs
     * @desc Get the Boards of a given user
     * @param {string} username The username to get Boards for
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_orgs(id) {
      return $http.get('/api/v1/accounts/' + id + '/orgs/', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }


    /**
     * @name get_boards
     * @desc Get the Boards of a given user
     * @param {string} username The username to get Boards for
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_boards(id) {
      return $http.get('/api/v1/accounts/' + id + '/boards/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name get_post
     * @desc Get the Posts of a given board
     * @param {integer} id The id of the board
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_post(id) {
      return $http.get('/api/v1/boards/' + id + '/posts/', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }


    /**
     * @name get_board
     * @desc Get the Board id from the board name
     * @param {integer} id The name of the board
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_board(id) {
      return $http.get('/api/v1/boards/' + id + '/board/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name get_public_board
     * @param {integer} id The id of the board
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_public_board(id) {
      return $http.get('/api/v1/boards/' + id + '/public_board/', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }


    /**
     * @name is_private
     * @desc Check if the board is private or not
     * @param {integer} id The id of the board
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function is_private(id) {
      return $http.get('/api/v1/boards/' + id + '/is_private/', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    /**
     * @name invite
     * @param id Email address to share board
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function invite(board_user, board_name, invited_user, description) {
       return $http.post('/api/v1/inviteboard/', {
         'board_user': board_user,
         'board_name': board_name,
         'invited_user': invited_user,
         'description': description
       },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + $window.localStorage.token
          }
        });
    }

    /**
     * @name add_user
     * @param board id, invited user email
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function add_user(board_id, invited_email){
      return $http.post('/api/v1/addtoboard/', {
        'board_id': board_id,
        'invited_email': invited_email,
        'is_follow': 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }

    /**
     * @name add_user
     * @param board id
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function unfollow(board_id, invited_email) {
      return $http.post('/api/v1/addtoboard/', {
        'board_id': board_id,
        'invited_email': invited_email,
        'is_follow': 0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


     /**
     * @name remove_user
     * @param board id
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function follow(board_id, invited_email){
      return $http.post('/api/v1/addtoboard/', {
        'board_id': board_id,
        'invited_email': invited_email,
        'is_follow': 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }

    /**
     * @name get_user
     * @param salt User register code
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_user(salt){
      return $http.get('/api/v1/boards/' + salt + '/invited_user/');
    }

    /**
     * @name get_allboards
     * @desc Get all boards of a given user
     * @param {integer} username The username
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_allboards(username) {
      return $http.get('/api/v1/boards/' + username + '/all_boards/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }

    /**
     * @name get_myboards
     * @desc Get a given user's boards
     * @param {integer} username The username
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_myboards(username) {
      return $http.get('/api/v1/boards/' + username + '/my_boards/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }

    /**
     * @name get_companyboards
     * @desc Get a given user's company boards
     * @param {integer} username The username
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_companyboards(username) {
      return $http.get('/api/v1/boards/' + username + '/company_boards/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }

    /**
     * @name get_privateboards
     * @desc Get a given user's private boards
     * @param {integer} username The username
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_privateboards(username) {
      return $http.get('/api/v1/boards/' + username + '/private_boards/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }

    /**
     * @name get_publicboards
     * @desc Get a given user's public boards
     * @param {integer} username The username
     * @returns {Promise}
     * @memberOf prism.boards.services.Boards
     */
    function get_publicboards() {
      return $http.get('/api/v1/public_boards/', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
  }
})();