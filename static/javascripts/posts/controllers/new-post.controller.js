/**
 * NewPostController
 * @namespace prism.posts.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.posts.controllers')
    .controller('NewPostController', NewPostController)
    .directive('bsDropdown', function ($compile) {
      return {
          restrict: 'E',
          scope: {
              items: '=dropdownData',
              doSelect: '&selectVal',
              selectedItem: '=preselectedItem'
          },
          link: function (scope, element, attrs) {
              var html = '';
              switch (attrs.menuType) {
                  case "button":
                      html += '<div class="btn-group dropdown-btn-group"><button class="btn button-label btn-info dropdown-toggle" type="button" data-toggle="dropdown">Select a board</button><button class="btn btn-info dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
                      break;
                  default:
                      html += '<div class="dropdown"><a class="dropdown-toggle" role="button" data-toggle="dropdown"  href="javascript:;">Dropdown<b class="caret"></b></a>';
                      break;
              }
              html += '<ul class="dropdown-menu"><li ng-repeat="item in items"><a tabindex="-1" data-ng-click="selectVal(item)">{{item.name}}</a></li><li role="presentation" class="divider"></li><li role="presentation"><a role="menuitem" tabindex="-1" data-ng-click="opendialog()" href="#">Create a new board +</a></li></ul></div>';
              element.append($compile(html)(scope));
              if (scope.items != undefined) {
                  for (var i = 0; i < scope.items.length; i++) {
                      if (scope.items[i].id === scope.selectedItem) {
                          scope.bSelectedItem = scope.items[i];
                          break;
                      }
                  }
              }
              scope.$watch('selectedItem', function(newValue, oldValue) {
                  if (scope.items != undefined) {
                      for (var i = 0; i < scope.items.length; i++) {
                          if (scope.items[i].id === newValue) {
                              scope.bSelectedItem = scope.items[i];
                              scope.selectVal(scope.bSelectedItem);
                              break;
                          }
                      }
                  }
                });
              scope.selectVal = function (item) {
                  switch (attrs.menuType) {
                      case "button":
                          $('button.button-label', element).html(item.name);
                          break;
                      default:
                          $('a.dropdown-toggle', element).html('<b class="caret"></b> ' + item.name);
                          break;
                  }
                  scope.doSelect({
                      selectedVal: item.id
                  });
              };
              scope.opendialog = function(){
                  scope.$parent.$parent.create_board();
              }
              if (scope.bSelectedItem != undefined) {
                  scope.selectVal(scope.bSelectedItem);
              }
          }
      };
    }).config(config);

  config.$inject = ['flowFactoryProvider'];
  function config(flowFactoryProvider) {
    flowFactoryProvider.defaults = {
      target: '',
      permanentErrors: [404, 500, 501],
      maxChunkRetries: 1,
      chunkRetryInterval: 5000,
      simultaneousUploads: 10
    };
    flowFactoryProvider.on('catchAll', function (event) {
      console.log('catchAll', arguments);
    });
    // Can be used with different implementations of Flow.js
    flowFactoryProvider.factory = fustyFlowFactory;
  }

  NewPostController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Posts', 'Boards', 'ngDialog'];

  /**
   * @namespace NewPostController
   */
  function NewPostController($rootScope, $scope, Authentication, Snackbar, Posts, Boards, ngDialog) {
    var vm = this;
    $scope.authuser = Authentication.getAuthenticatedAccount().username;
    $scope.submit = submit;
    $scope.isPosted = false;
    $scope.selected_board = '';

    $scope.image = [];
    $scope.description = '';
    $scope.email = '';
    $scope.username = '';
    $scope.report_link = '';
    $scope.selected_type = 0;
    $scope.post_types = [];

    $scope.isClipboard = false;
    if ($scope.obj == undefined){
      $scope.obj = {};
      $scope.obj.flowObject = null;
    }

    activate();

    function activate() {
        var username = Authentication.getAuthenticatedAccount().username;
        Boards.get_boards(username).then(boardsSuccessFn, boardsErrorFn);
    }

    $scope.create_board = function() {
        var dialog = ngDialog.open({
            templateUrl: '/static/templates/boards/new-board.html'
        });
        dialog.closePromise.then(function (data) {
          console.log(data);
        });
    }

    $scope.$on('board.created', function (event, board) {
      $scope.post_types.push({id: board.id, name: board.title});
      $scope.selected_type = board.id;
    });


    /**
     * @name boardsSuccessFn
     * @desc Update thoughts array on view
     */
    function boardsSuccessFn(data, status, headers, config) {
      if ($rootScope.currentboard_id != undefined) {
          $scope.selected_type = $rootScope.currentboard_id;
      }
      for (var i=0; i < data.data.length; i++) {
        $scope.post_types.unshift({id: data.data[i].id, name: data.data[i].title});
      }
      if(!$scope.$$phase) {
        //$digest or $apply
        $scope.$apply();
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
     * @name submit
     * @desc Create a new Post
     * @memberOf prism.posts.controllers.NewPostController
     */
    function submit() {
      $scope.image = [];
      for (var i = 0; i < $scope.$$childHead.$flow.files.length; i++) {
        $scope.image.push($(".image-thumb img")[i].src);
      }
      if ($scope.isClipboard){
        $scope.image.push($(".thumbnail img")[0].src)
      }
      if ($scope.image.length == 0 && $scope.isClipboard == false){
        Snackbar.show('Please upload your snapshot!');
      } else {
        $scope.isPosted = true;
        $scope.isClipboard = false;
          if ($scope.$$childHead.selected_type == 0) {
            $scope.selected_board = '';
            Posts.create($scope.image, $scope.$$childHead.description, $scope.$$childHead.username, $scope.$$childHead.report_link, 0).then(createPostSuccessFn, createPostErrorFn);
          } else {
            var board = $.grep($scope.post_types, function (e) {
                return e.id == $scope.$$childHead.selected_type;
            });
            $scope.selected_board = board[0].id;
            Posts.create($scope.image, $scope.$$childHead.description, $scope.$$childHead.username, $scope.$$childHead.report_link, board[0].id).then(createPostSuccessFn, createPostErrorFn);
          }
      }


      /**
       * @name createPostSuccessFn
       * @desc Show snackbar with success message
       */
      function createPostSuccessFn(data, status, headers, config) {
        var authAccount = Authentication.getAuthenticatedAccount();
        var authUsername = '';
        if (authAccount.username == undefined){
            authUsername = '';
        } else {
            authUsername = authAccount.username;
        }
        $rootScope.$broadcast('post.created', {
          image: data.data.image,
          description: data.data.description,
          author: {
            username: authUsername
          },
          id: data.data.id
        });

        $scope.isPosted = false;
        $scope.closeThisDialog();

        //setTimeout(function(){$(".board" + data.data.board[0]).trigger('click');}, 500);

        /* Segment Tracking Event */
        analytics.track('Post', {
        });
        Snackbar.show('Success! Post created.');

        if ($scope.selected_board != '') {
            window.location = '/board/' + $scope.selected_board;
        }
      }

      
      /**
       * @name createPostErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function createPostErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('post.created.error');
        Snackbar.error(data.error);
        $scope.isPosted = false;
      }
    }
  }
})();