(function () {
  'use strict';

  angular
    .module('prism.layout', [
      'prism.layout.controllers'
    ]);

  angular
    .module('prism.layout.controllers', ['ngDialog']);
})();