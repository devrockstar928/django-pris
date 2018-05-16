/**
 * NavbarController
 * @namespace prism.layout.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Snackbar', 'Account','Boards', 'ngDialog'];


  /**
   * @namespace NavbarController
   */
  function NavbarController($scope, $rootScope, $stateParams, $location, Authentication, Snackbar, Account, Boards, ngDialog) {
    var vm = this;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.username = '';
    vm.email = '';
    vm.boards = [];
    vm.orgs = [];
    vm.account = '';
    vm.select_board = select_board;
    vm.logout = logout;
    vm.isvalid = isvalid;
    vm.unfollow = unfollow;
    vm.create_board = create_board;
    vm.follow = follow;
    vm.isBoardPage = isBoardPage;
    vm.isPageLoaded = isPageLoaded;
    vm.isSubscriber = isSubscriber;
    vm.canShowNumber = canShowNumber;
    vm.isBoardOwner = isBoardOwner;

    vm.board_avatars = [];
    vm.board_creator = [];
    vm.board_desc = '';

    $scope.flag = true;
    $scope.selectedItem = 'Everything';

    $scope.init = function(value) {
      $scope.selectedItem= value;
    }

    activate();

    function activate() {
      if (vm.isAuthenticated) {
        vm.username = Authentication.getAuthenticatedAccount().username;
        Account.get(vm.username).then(accountSuccessFn, accountErrorFn);
        Boards.get_orgs(vm.username).then(orgsSuccessFn, orgsErrorFn);

      }

      $scope.$on('board.created', function (event, board) {
        vm.boards.push(board);
      });

      $scope.$on('invite.board', function (event, user) {
        $.grep(vm.boards, function (e) {
            if (e.id == $rootScope.currentboard_id){
              e.is_share = 1;
            }
        });
      });

      $scope.$on('board.avatar', function (event, board){
        vm.board_avatars = board.board_avatars;
        vm.board_creator = board.board_creator;
        vm.board_desc = board.board_desc;
      });

      $rootScope.$watch('currentboard_id', function () {
        if ($rootScope.currentboard_id == 0){
          vm.board_creator = [];
        }
      });

      $rootScope.$watch('currentboard_name', function () {
        $scope.selectedItem = $rootScope.currentboard_name;
      });
    }

    /**
     * @name accountSuccessFn
     * @desc Update `account` for view
     */
    function accountSuccessFn(data, status, headers, config) {
      vm.account = data.data;
    }

    /**
     * @name accountErrorFn
     * @desc Redirect to index
     */
    function accountErrorFn(data, status, headers, config) {
      $location.url('/');
      Snackbar.error('That user does not exist.');
    }

    /**
     * @name orgsSuccessFn
     * @desc Update thoughts array on view
     */
    function orgsSuccessFn(data, status, headers, config) {
      vm.orgs = data.data;
      Boards.get_boards(vm.username).then(boardsSuccessFn, boardsErrorFn);
    }


    /**
     * @name orgsErrorFn
     * @desc Show snackbar with error
     */
    function orgsErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
     * @name boardsSuccessFn
     * @desc Update thoughts array on view
     */
    function boardsSuccessFn(data, status, headers, config) {
      for (var i=0; i < data.data.length; i++) {
        var is_lock = [];
        if (vm.orgs.length > 0) {
          is_lock = $.grep(vm.orgs[0].users, function (e) {
            return e.username == data.data[i].author.username && e.username != vm.username;
          });
        }

        vm.boards.unshift({id: data.data[i].id, title: data.data[i].title, url: data.data[i].title.toLowerCase().replace(/\s+/g, '-'),
          username: data.data[i].author.username, is_share: data.data[i].invited_users.length > 1 ? 1:0, is_lock: is_lock.length>0? 1:0});
      }
    }


    /**
     * @name boardsErrorFn
     * @desc Show snackbar with error
     */
    function boardsErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }


    /**
     * @name select_board
     * @desc Broadcast select board event
     * @id = id of the board
     */
    function select_board(id,  title){
      $scope.selectedItem = title;
      $rootScope.$broadcast('board.selected', {
        id: id
      });
    }

    /**
     * @name create_board
     * @desc Create New Board
     * @memberOf prism.layout.controllers.NavbarController
     */
    function create_board() {
      var dialog = ngDialog.open({
        templateUrl: '/static/templates/boards/new-board.html',
        controller:'NewBoardController',
        controllerAs: 'vm',
        scope: $scope,
        //preCloseCallback: function(value) {
        //  var nestedConfirmDialog = ngDialog.openConfirm({
        //      template:'\
        //          <p>Are you sure you want to close the parent dialog?</p>\
        //          <div class="ngdialog-buttons">\
        //              <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
        //              <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
        //          </div>',
        //      plain: true
        //  });
        //
        //  // NOTE: return the promise from openConfirm
        //  return nestedConfirmDialog;
        //}
      });
      dialog.closePromise.then(function (data) {
          console.log(data);
      });
    }

    /**
     * @name logout
     * @desc Log the user out
     * @memberOf prism.layout.controllers.NavbarController
     */
    function logout() {
      Authentication.logout();
    }

    /**
     * @name isvalid
     * @param object
     * @memberOf prism.layout.controllers.NavbarController
     * @returns {boolean}
     */
    function isvalid(object) {
      if (object && object.username){
        return true;
      }
      return false;
    }

    /**
     * @name isSubscriber
     * @memberOf prism.layout.controllers.NavbarController
     * @returns {boolean}
     */
    function isSubscriber() {
      var subscribers = $.grep(vm.board_avatars, function (e) {
        return e.username == vm.username;
      });

      return subscribers.length>0?true:false;
    }

    /**
     * @name unfollow
     * @memberOf prism.layout.controllers.NavbarController
     * @returns {boolean}
     */
    function unfollow() {
      Boards.unfollow($rootScope.currentboard_id, vm.account.email).then(unfollowSuccessFn, unfollowErrorFn);
    }

    /**
     * @name follow
     * @memberOf prism.layout.controllers.NavbarController
     * @returns {boolean}
     */
    function follow() {
      Boards.follow($rootScope.currentboard_id, vm.account.email).then(followSuccessFn, followErrorFn);
    }

    /**
     * @name followSuccessFn
     * @desc Update thoughts array on view
     */
    function followSuccessFn(data, status, headers, config) {
      if (data.data.length > 0) {
        vm.board_avatars.push(data.data[0]);
      }
      Snackbar.show('Successfully watched.');
    }


    /**
     * @name followErrorFn
     * @desc Show snackbar with error
     */
    function followErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
     * @name unfollowSuccessFn
     * @desc Update thoughts array on view
     */
    function unfollowSuccessFn(data, status, headers, config) {
      var idx = -1;
      for (var i=0;i<vm.board_avatars.length;i++)
      {
        if (vm.board_avatars[i].username == data.data[0].username) {
          idx = i;
        }
      }
      vm.board_avatars.splice(idx, 1);
      Snackbar.show('Successfully un-watched.');
    }


    /**
     * @name unfollowErrorFn
     * @desc Show snackbar with error
     */
    function unfollowErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
     * @name isBoardPage
     * @desc Check if current page is a board page
     */
    function isBoardPage(){
      if ($rootScope.currentboard_id > 0){
        return true;
      }
      return false;
    }

    /**
     * @name canShowNumber
     * @desc Determine if the number of subscribers is over 4
     */
    function canShowNumber(){
      if (vm.board_avatars.length > 4) {
        return true;
      }
      return false;
    }

    /**
     * @name isBoardOwner
     * @desc Determine if the logged in user is a board owner
     */
    function isBoardOwner(){
      if (vm.username == vm.board_creator.username){
        return true;
      }
      return false;
    }

    /**
     * @name isPageLoaded
     * @desc Determine if all posts are loaded
     */
    function isPageLoaded(){
      if ($rootScope.posts_loaded){
        return true;
      }
      return false;
    }
  }
})();