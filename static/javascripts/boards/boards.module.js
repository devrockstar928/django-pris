(function () {
  'use strict';

  angular
    .module('prism.boards', [
      'prism.boards.controllers',
      'prism.boards.directives',
      'prism.boards.services'
    ]);

  angular
    .module('prism.boards.controllers', []);

  angular
    .module('prism.boards.directives', ['ngDialog']);

  angular
    .module('prism.boards.services', []);
})();