(function () {
  'use strict';

  angular
    .module('prism.routes')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$stickyStateProvider'];

  /**
   * @name config
   * @desc Define valid application routes
   */
  function config($stateProvider, $urlRouterProvider, $stickyStateProvider) {
    $stickyStateProvider.enableDebug(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('home', {
      url: '/',
      template: "<div ui-view></div>",
      controller: function($scope, $state, Authentication) {
        if (Authentication.isAuthenticated()){
          $state.go('home.loggedin');
        } else {
          $state.go('home.public');
        }
        $scope.goToLoggedInState = function(){
          $state.go('home.loggedin');
        }
        $scope.goToPublicState = function(){
          $state.go('home.public');
        }
      }
    });
    $stateProvider.state('home.loggedin', {
      controller: 'IndexController',
      controllerAs: 'vm',
      url: '',
      templateUrl: '/static/templates/layout/index.html',
      sticky: true
    });
    $stateProvider.state('home.public', {
      controller: 'HomeController',
      controllerAs: 'vm',
      url: '',
      templateUrl: '/static/templates/layout/home.html',
      sticky: true
    });
    $stateProvider.state('about', {
      controller: 'HomeController',
      controllerAs: 'vm',
      url: '/about',
      templateUrl: '/static/templates/layout/about.html',
      sticky: true
    });
    $stateProvider.state('api', {
      controller: 'HomeController',
      controllerAs: 'vm',
      url: '/api',
      templateUrl: '/static/templates/layout/api.html',
      sticky: true
    });
    $stateProvider.state('register', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      url: '/register',
      templateUrl: '/static/templates/authentication/register.html'
    });
    $stateProvider.state('preregister', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      url: '/register/:salt',
      templateUrl: '/static/templates/authentication/register.html'
    });
    $stateProvider.state('login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      url: '/login',
      templateUrl: '/static/templates/authentication/login.html'
    });
    $stateProvider.state('discover', {
      controller: 'DiscoverController',
      controllerAs: 'vm',
      url: '/discover',
      templateUrl: '/static/templates/layout/discover.html'
    });
    $stateProvider.state('account', {
      controller: 'AccountController',
      controllerAs: 'vm',
      url: '/+:username',
      templateUrl: '/static/templates/accounts/account.html'
    });
    $stateProvider.state('setting', {
      controller: 'AccountSettingsController',
      controllerAs: 'vm',
      url: '/+:username/settings',
      templateUrl: '/static/templates/accounts/settings.html'
    });
    $stateProvider.state('board', {
      controller: 'IndexController',
      controllerAs: 'vm',
      url: '/board/:board_id',
      templateUrl: '/static/templates/layout/index.html',
    });
    $stateProvider.state('modal', {
      url: '/post/:post_id',
      template: '<div ui-view="modal"></div>',
      onEnter: showModal
    })
    function showModal($modal, $previousState) {
      $previousState.memo("modalInvoker"); // remember the previous state with memoName "modalInvoker"

      $modal.open({
        templateUrl: '/static/templates/posts/post-lightbox.html',
        backdrop: 'static',
        keyboard: false,
        controller:'PostPopupController'
      })
    }

  }
})();