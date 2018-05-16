(function () {
  'use strict';

  angular
    .module('prism.comments', [
      'prism.comments.controllers',
      'prism.comments.directives',
      'prism.comments.services'
    ]);

  angular
    .module('prism.comments.controllers', []);

  angular
    .module('prism.comments.directives', ['ngDialog']);

  angular
    .module('prism.comments.services', []);
})();