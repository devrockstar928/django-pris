(function () {
  'use strict';

  angular
    .module('prism.posts', [
      'prism.posts.controllers',
      'prism.posts.directives',
      'prism.posts.services'
    ]);

  angular
    .module('prism.posts.controllers', ['ct.ui.router.extras', 'ngScrollbar', 'textAngular', 'textAngularSetup', 'ngSanitize', 'flow', 'ngDialog', 'infinite-scroll']);

  angular
    .module('prism.posts.directives', ['ngDialog']);

  angular
    .module('prism.posts.services', []);
})();