  /**
 * IndexController
 * @namespace prism.layout.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.layout.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', '$rootScope', '$stateParams', 'Authentication', 'Posts', 'Boards', 'Snackbar', 'ngDialog', '$controller'];

  /**
   * @namespace IndexController
   */
  function IndexController($scope, $rootScope, $stateParams, Authentication, Posts, Boards, Snackbar, ngDialog, $controller) {
    var vm = this;
    var username  = '';
    var board_id = 0;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.posts = [];
    vm.boards = [];
    vm.org_users = [];
    vm.board = [];
    vm.login = login;
    vm.post_dialog = post_dialog;
    vm.isHomescreen = isHomescreen;
    vm.isPostsLoaded = isPostsLoaded;
    vm.isBoardsLoaded = isBoardsLoaded;
    vm.isLoggedin = isLoggedin;
    vm.selectBoard = selectBoard;
    vm.create_board = create_board;
    vm.dropdowns = ['All Boards', 'My Boards', 'My Company Boards', 'Private Boards', 'Public Boards'];
    vm.board_class = ['board-all', 'board-my', 'board-co', 'board-private', 'board-public'];
    vm.index = 0;
    vm.is_private = true;
    vm.next = '/';
    $scope.current_board = '';
    $scope.board_user = '';
    $scope.selectedItem = 'All Boards';

    if ($stateParams.board_id != undefined){
      $rootScope.currentboard_id = $stateParams.board_id;
      Boards.is_private($rootScope.currentboard_id).then(isPrivateSuccessFn, isPrivateErrorFn);
    } else {
      // Redirect to login screen if not authed
      if (vm.isAuthenticated) {
        // do nothing
        username = Authentication.getAuthenticatedAccount().username;
        activate();
      }else{
        window.location = '/login';
      }
    }

    /**
     * @name isPrivateSuccessFn
     */
    function isPrivateSuccessFn(data, status, headers, config) {
      vm.is_private = data.data.is_private;
      if (vm.isAuthenticated) {
        // do nothing
        username = Authentication.getAuthenticatedAccount().username;
      }
      if (data.data.is_private){
        // Redirect to login screen if not authed
        if (!vm.isAuthenticated) {
          vm.next = '';
          if ($stateParams.board_id != undefined) {
            vm.next = '/board/' + $stateParams.board_id;
            window.location = '/login' + '?next=' + vm.next;
          } else {
            window.location = '/login';
          }
        }
      } else {
        if ($stateParams.board_id != undefined) {
          vm.next = '/board/' + $stateParams.board_id;

          if (!vm.isAuthenticated) {
            var dialog = ngDialog.open({
              templateUrl: '/static/templates/authentication/login.html',
              controller: 'LoginController',
              controllerAs: 'vm',
              scope: $scope,
              closeByEscape: false,
              closeByDocument: false,
              showClose: false //<-- while opening dialog make it false
            });
            dialog.closePromise.then(function (data) {
              console.log(data);
            });
          }
        }
      }
      activate();
    }

     /**
     * @name isPrivateErrorFn
     * @desc Show snackbar with error
     */
    function isPrivateErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf prism.layout.controllers.IndexController
     */
    function activate() {
      var idx;
      vm.isAuthenticated = vm.isAuthenticated || !vm.is_private;
      $rootScope.posts_loaded = 0;
      $rootScope.boards_loaded = 0;

      if ($stateParams.board_id != undefined){
        /* temporarily set */
        if (vm.is_private) {
          Boards.get_board($rootScope.currentboard_id).then(getboardSuccessFn, getboardErrorFn);
        } else {
          Boards.get_public_board($rootScope.currentboard_id).then(getboardSuccessFn, getboardErrorFn);
        }
      } else {
        $rootScope.currentboard_id = 0;
        $rootScope.board_owner = '';
        $(".board__name").text('EVERYTHING');
        // Posts.get(username).then(postsSuccessFn, postsErrorFn);
        Boards.get_orgs(username).then(userorgsSuccessFn, userorgsErrorFn);
      }

      function make_hotlink(p1){
        return '<a href="/+' + p1.substring(1) +  '">' + p1.substring(1) + '</a>';
      }

      function remove_target(pl){
        return '';
      }

      function add_target(pl){
        return 'target="_blank" ' + pl;
      }

      function insert_target(pl){
        pl = pl.replace(/target="\w+"/g, remove_target);
        pl = pl.replace(/href/g, add_target);
        return pl;
      }

      $scope.$on('invite.board', function (event, user) {
        var is_orguser = $.grep(vm.org_users, function (e) {
          return e.username == username;
        });

        if (is_orguser.length == 0){
          Snackbar.show('Please select the related board.');
        } else {
          Boards.invite($scope.board_user, $scope.current_board, user.email, user.description).then(inviteBoardSuccessFn, inviteBoardErrorFn);
        }
      });

      $scope.$on('post.created', function (event, post) {
        post.description = post.description.replace(/@\w+/g, make_hotlink);
        post.description = post.description.replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, insert_target);
      });

      $scope.$on('post.created.error', function () {
        //vm.posts.shift();
      });

      $scope.$on('post.deleted', function (event, post) {
        idx = -1;
        for (var i=0;i<vm.posts.length;i++)
        {
          if (vm.posts[i].id == post.post_id) {
            idx = i;
          }
        }
        vm.posts.splice(idx, 1)
      });

      $scope.$on('post.deleted.error', function () {
        //vm.posts.shift();
      });
    }

    function post_dialog(){
      var dialog = ngDialog.open({
        templateUrl: '/static/templates/posts/new-post.html',
        controller: 'NewPostController',
        controllerAs: 'vm',
      });
      dialog.closePromise.then(function (data) {
        console.log(data);
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

    function isLoggedin(){
      if (vm.isAuthenticated){
        return true;
      }else{
      return false;
      }
    }

    function isHomescreen() {
      if ($rootScope.currentboard_id > 0) {
        return false;
      }
      return true;
    }

    function isPostsLoaded() {
      if ($rootScope.posts_loaded == 1) {
        return true;
      }
      return false;
    }

    function isBoardsLoaded() {
      if ($rootScope.boards_loaded == 1) {
        return true;
      }
      return false;
    }

    /**
     * @name selectBoard
     * @id = which menu to be selected
     */
    function selectBoard(id){
      if (vm.index != id) {
        $rootScope.boards_loaded = 0;
        vm.boards = [];
        vm.index = id;
        $scope.selectedItem = vm.dropdowns[id];

        if (vm.index == 0) {
          Boards.get_allboards(username).then(boardsSuccessFn, boardsErrorFn);
        } else if (vm.index == 1) {
          Boards.get_myboards(username).then(boardsSuccessFn, boardsErrorFn);
        } else if (vm.index == 2) {
          Boards.get_companyboards(username).then(boardsSuccessFn, boardsErrorFn);
        } else if (vm.index == 3) {
          Boards.get_privateboards(username).then(boardsSuccessFn, boardsErrorFn);
        } else if (vm.index == 4) {
          Boards.get_publicboards().then(boardsSuccessFn, boardsErrorFn);
        }
      }
    }

    /**
     * @name boardPostsSuccessFn
     * @desc Update thoughts array on view
     */
    function boardPostsSuccessFn(data, status, headers, config) {
      vm.posts = data.data;
      $rootScope.posts_loaded = 1;
    }


    /**
     * @name postsErrorFn
     * @desc Show snackbar with error
     */
    function boardPostsErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }


    /**
     * @name postsSuccessFn
     * @desc Update thoughts array on view
     */
    function postsSuccessFn(data, status, headers, config) {
      //vm.posts =  _.filter(data.data, function(post){ return post.author.username == username; });
      vm.posts = data.data;
    }


    /**
     * @name postsErrorFn
     * @desc Show snackbar with error
     */
    function postsErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }


    /**
     * @name getboardSuccessFn
     */
    function getboardSuccessFn(data, status, headers, config) {
      var flag = false;
      var menu = '';
      vm.board = data.data[0];

      $scope.current_board = vm.board.title.toLowerCase().replace(/\s+/g, '-');
      $scope.board_user = vm.board.author.username;
      $rootScope.board_owner = vm.board.author.username;

      Boards.get_orgs(vm.board.author.username).then(userorgsSuccessFn, userorgsErrorFn);
      // Boards.get_boards(username).then(userboardsSuccessFn, userboardsErrorFn);

      if (vm.board.is_private) {
          flag = true;
          board_id = vm.board.id;
          menu = vm.board.title;
          $rootScope.currentboard_id = board_id;
          $rootScope.$broadcast('board.avatar', {
            board_avatars: vm.board.subscriber,
            board_creator: vm.board.author,
            board_desc: vm.board.description
          });
      } else {
        flag = true;
        menu = vm.board.title;
        $rootScope.currentboard_id = vm.board.id;
        $rootScope.$broadcast('board.avatar', {
          board_avatars: vm.board.subscriber,
          board_creator: vm.board.author,
          board_desc: vm.board.description
        });
      }
      if (flag == false){
        $rootScope.currentboard_name = 'Everything';
        window.location = '/';
      } else {
        $rootScope.currentboard_name = menu;
        board_id = vm.board.id;
        Boards.get_post(board_id).then(boardPostsSuccessFn, boardPostsErrorFn);
      }
    }

    /**
     * @name getboardErrorFn
     * @desc Show snackbar with error
     */
    function getboardErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
     * @name boardsSuccessFn
     */
    function boardsSuccessFn(data, status, headers, config) {
      vm.boards = [];
      vm.boards = data.data;
      $rootScope.boards_loaded = 1;
      var i;
      if (vm.index != 0) {
        for (i = 0; i < vm.boards.length; i++) {
          vm.boards[i].class = vm.board_class[vm.index];
        }
      } else {
        for (i = 0; i < vm.boards.length; i++) {
          vm.boards[i].class = '';
          if (vm.boards[i].is_private == false) {
            vm.boards[i].class = vm.boards[i].class + 'board-public ';
          } else {
            vm.boards[i].class = vm.boards[i].class + 'board-private ';
          }

          if (vm.boards[i].author.username == username) {
            vm.boards[i].class = vm.boards[i].class + 'board-my ';
          }

          var is_orguser = $.grep(vm.org_users, function (e) {
            return e.username == vm.boards[i].author.username;
          });
          if (is_orguser.length >= 1) {
            vm.boards[i].class = vm.boards[i].class + 'board-co ';
          }

        }
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
     * @name userboardsSuccessFn
     * @desc Update thoughts array on view
     */
    function userboardsSuccessFn(data, status, headers, config) {

    }


    /**
     * @name userboardsErrorFn
     * @desc Show snackbar with error
     */
    function userboardsErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
    * @name userorgsSuccessFn
    * @desc Show snackbar with success message
    */
    function userorgsSuccessFn(data, status, headers, config) {
      if (data.data.length > 0) {
        vm.org_users = data.data[0].users;
      }
      if ($stateParams.board_id == undefined) {
        Boards.get_allboards(username).then(boardsSuccessFn, boardsErrorFn);
      }
    }

    /**
    * @name userorgsErrorFn
    * @desc Propogate error event and show snackbar with error message
    */
    function userorgsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
    }

    /**
    * @name inviteBoardSuccessFn
    * @desc Show snackbar with success message
    */
    function inviteBoardSuccessFn(data, status, headers, config) {
      console.log(data);
      Snackbar.show('Successfully invited.');
    }


    /**
    * @name inviteBoardErrorFn
    * @desc Propogate error event and show snackbar with error message
    */
    function inviteBoardErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('invite.board.error');
        Snackbar.error(data.error);
    }

    /**
    * @name login
    * @desc Log the user in
    * @memberOf prism.authentication.controllers.LoginController
    */
    function login() {
      Authentication.login(vm.email, vm.password, [], vm.next);
    }

  }
})();
