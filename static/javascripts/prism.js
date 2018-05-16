(function () {
  'use strict';

  angular
    .module('prism', [
    'prism.config',
    'prism.routes',
    'prism.accounts',
    'prism.authentication',
    'prism.layout',
    'prism.posts',
    'prism.utils',
    'prism.comments',
    'prism.boards'
    ]);

  angular
    .module('prism.config', []);

  angular
    .module('prism.routes', ['ui.router', 'ui.bootstrap', 'ct.ui.router.extras', 'ngMaterial']);

  angular
    .module('prism')
    .run(run);

  angular.module('prism').
    filter('fromNow', function() {
    return function(dateString) {
      if (dateString == undefined){
        return '';
      }
      return moment(dateString).fromNow()
    };
  }).
    filter('capitalize', function() {
    return function(input, all) {
      return input.charAt(0).toUpperCase();
    }
  });

  run.$inject = ['$http', '$rootScope'];

  /**
   * @name run
   * @desc Update xsrf $http headers to align with Django's defaults
   */
  function run($http, $rootScope) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
    $rootScope.currentboard_id = 0;
  }
})();