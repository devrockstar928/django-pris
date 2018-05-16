(function () {
  'use strict';

  angular
    .module('prism.authentication', [
      'prism.authentication.controllers',
      'prism.authentication.services'
    ]);

  angular
    .module('prism.authentication.controllers', []);

  angular
    .module('prism.authentication.services', ['ngCookies']);
})();