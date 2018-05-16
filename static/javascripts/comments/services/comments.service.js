/**
 * Comments
 * @namespace prism.comments.services
 */
(function () {
  'use strict';

  angular
    .module('prism.comments.services')
    .factory('Comments', Comments);

  Comments.$inject = ['$http', '$window'];

  /**
   * @namespace Comments
   * @returns {Factory}
   */
  function Comments($http, $window) {
    var Comments = {
      all: all,
      get: get,
      create: create
    };

    return Comments;

    ////////////////////
    
    /**
     * @name all
     * @desc Get all Comments
     * @returns {Promise}
     * @memberOf prism.comments.services.Comments
     */
    function all() {
      return $http.get('/api/v1/comments/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name create
     * @desc Create a new Comment
     * @param {string} comment The content of the new Comment
     * @returns {Promise}
     * @memberOf prism.comments.services.Comments
     */
    function create(comment, post_id) {
      return $http.post('/api/v1/comments/', {
        'comment': comment,
        'post': post_id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }


    /**
     * @name get
     * @desc Get the Comments of a given user
     * @param {string} username The username to get Comments for
     * @returns {Promise}
     * @memberOf prism.comments.services.Comments
     */
    function get(post_id) {
      return $http.get('/api/v1/comments/?post=' + post_id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $window.localStorage.token
        }
      });
    }
  }
})();