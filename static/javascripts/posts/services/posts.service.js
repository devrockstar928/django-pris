/**
 * Posts
 * @namespace prism.posts.services
 */
(function () {
  'use strict';

  angular
    .module('prism.posts.services')
    .factory('Posts', Posts);

  Posts.$inject = ['$http', '$window'];

  /**
   * @namespace Posts
   * @returns {Factory}
   */
  function Posts($http, $window) {
    var Posts = {
      get_post: get_post,
      get: get,
      create: create,
      delete: delete_post,
      get_like: get_like,
      like: like,
      unlike: unlike
    };

    return Posts;

    ////////////////////
    
    /**
     * @name get_post
     * @desc Get the post of given id
     * @returns {Promise}
     * @memberOf prism.posts.services.Posts
     */
    function get_post(id) {
      return $http.get('/api/v1/posts/' + id + '/post/', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name create
     * @desc Create a new Post
     * @param {string} content The content of the new Post
     * @returns {Promise}
     * @memberOf prism.posts.services.Posts
     */
    function create(image, description, username, report_link, board_id) {
      return $http.post('/api/v1/posts/', {
        'image': image,
        'description': description,
        'username': username,
        'report_link': report_link,
        'board_id': board_id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name delete
     * @desc Delete a Post
     * @param {integer} id The id of the Post
     * @returns {Promise}
     * @memberOf prism.posts.services.Posts
     */
    function delete_post(id) {
      return $http.delete('/api/v1/posts/' + id + '/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name get
     * @desc Get the Posts of a given user
     * @param {string} username The username to get Posts for
     * @returns {Promise}
     * @memberOf prism.posts.services.Posts
     */
    function get(id) {
      return $http.get('/api/v1/accounts/' + id + '/posts/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name like
     * @desc Add like to a Post or remove like
     * @returns {Promise}
     * @memberOf prism.posts.services.Posts
     */
    function like(id) {
      return $http.post('/api/v1/postlikes/', {
        'id': id,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }

    /**
     * @name unlike
     * @desc Unlike
     * @param {integer} id The id of the Post
     * @returns {Promise}
     * @memberOf prism.posts.services.Posts
     */
    function unlike(id) {
      return $http.delete('/api/v1/postlikes/' + id + '/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }

    /**
     * @name get
     * @desc Get the Posts of a given user
     * @param {string} username The username to get Posts for
     * @returns {Promise}
     * @memberOf prism.posts.services.Posts
     */
    function get_like(id) {
      return $http.get('/api/v1/posts/' + id + '/postlikes/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }
  }
})();