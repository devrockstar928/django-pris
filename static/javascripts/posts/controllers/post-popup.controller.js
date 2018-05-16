/**
 * PostController
 * @namespace prism.posts.controllers
 */
(function () {
  'use strict';

  angular
    .module('prism.posts.controllers')
    .controller('PostPopupController', PostPopupController)
    .directive('elastic', [
      '$timeout',
      function($timeout) {
        return {
          restrict: 'A',
          link: function($scope, element) {
            var resize = function() {
              var height = element[0].scrollHeight;
              return element[0].style.height = "" + height + "px";
            };
            element.on("blur keyup change", resize);
            $timeout(resize, 0);
          }
        };
      }
    ]);

  PostPopupController.$inject = ['$rootScope', '$location', '$modalInstance', '$previousState', '$stateParams', '$scope', '$state', '$mdSidenav', '$log', 'Authentication', 'Snackbar', 'Posts', 'Comments'];

  /**
   * @namespace PostController
   */
  function PostPopupController($rootScope, $location, $modalInstance, $previousState, $stateParams, $scope, $state, $mdSidenav, $log, Authentication, Snackbar, Posts, Comments) {
    var vm = this;
    var post_id = $stateParams.post_id.substr(0);

    $scope.post_id = 0;
    $scope.comment_count = 0;
    $scope.like_count = 0;
    $scope.like_id = 0;
    $scope.is_liked = false;

    $scope.isLoaded = false;
    $scope.post = null;
    $scope.user = null;
    $scope.comments = [];
    $scope.comment = '';

    $scope.like_unlike = like_unlike;
    $scope.submit = submit;
    $scope.modal_close = modal_close;
    $scope.cancel = cancel;
    $scope.key_capture = key_capture;

    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle()
                        .then(function(){
                            $log.debug("toggle LEFT is done");
                        });
    };

    $scope.toggleRight = function() {
      $mdSidenav('right').toggle()
                          .then(function(){
                            $log.debug("toggle RIGHT is done");
                          });
    };

    $scope.close_left = function() {
      $mdSidenav('left').close()
                        .then(function(){
                          $log.debug("close LEFT is done");
                        });
    };

    $scope.close_right = function() {
      $mdSidenav('right').close()
                          .then(function(){
                            $log.debug("close RIGHT is done");
                          });
    };

    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.posts = [];


    // Redirect to login screen if not authed
    if (vm.isAuthenticated) {
        // do nothing
    }else{
      var suffix = '';
      if ($stateParams.post_id != undefined){
        suffix = '/post/' + $stateParams.post_id;
        window.location = '/login' + '?next=' + suffix;
      } else {
        window.location = '/login';
      }
    }

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf prism.posts.controllers.PostPopupController
     */
    function activate() {
      var username = Authentication.getAuthenticatedAccount().username;
      $scope.user = Authentication.getAuthenticatedAccount();
      //Posts.get(username).then(postsSuccessFn, postsErrorFn);
      Posts.get_post(post_id).then(postsSuccessFn, postsErrorFn);

      Posts.get_like(post_id).then(getLikeSuccessFn, getLikeErrorFn);

      /**
       * @name getLikeSuccessFn
       * @desc Show snackbar with success message
       */
      function getLikeSuccessFn(data, status, headers, config) {
        $scope.like_count = data.data.length;
        for (var i=0; i<data.data.length; i++) {
          if (data.data[i].post.id == post_id) {
            if (username == data.data[i].author.username) {
              $scope.like_id = data.data[i].id;
              $scope.is_liked = true;
              $(".action-fav-" + post_id + "").addClass('liked');
            }
          }
        }
      }


      /**
       * @name getLikeErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function getLikeErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }

      function make_hotlink(p1){
        return '<a href="/+' + p1.substring(1) +  '">' + p1.substring(1) + '</a>';
      }

      function replace_newline(pl) {
        return '<br/>';
      }

      /**
       * @name postsSuccessFn
       * @desc Update thoughts array on view
       */
      function postsSuccessFn(data, status, headers, config) {
        vm.posts = data.data;
        var idx = -1;
        for (var i=0;i<vm.posts.length;i++)
        {
          if (vm.posts[i].id == post_id) {
            idx = i;
            $scope.post = vm.posts[i];
            $scope.post.description = $scope.post.description.replace(/@\w+/g, make_hotlink);
          }
        }
        if (idx != -1) {
          Comments.get(post_id).then(commentsSuccessFn, commentsErrorFn);
        } else {
          Snackbar.show('You don\'t have post read privileges');
          setTimeout(function(){
            $scope.isLoaded = true;
            window.location = '/login';
          }, 2000);
        }
      }


      /**
       * @name postsErrorFn
       * @desc Show snackbar with error
       */
      function postsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
        $scope.isLoaded = true;
      }

      /**
       * @name commentsSuccessFn
       * @desc Update thoughts array on view
       */
      function commentsSuccessFn(data, status, headers, config) {
        $scope.comments = data.data;
        $scope.comment_count = $scope.comments.length;
        angular.forEach($scope.comments, function(comment, key){
          comment.comment = comment.comment.replace(/@\w+/g, make_hotlink);
          comment.comment = comment.comment.replace(/\n/g, replace_newline);
        });
        $scope.isLoaded = true;
      }

      /**
       * @name commentsErrorFn
       * @desc Show snackbar with error
       */
      function commentsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
        $scope.isLoaded = true;
      }

      $scope.$on('comment.created.' + post_id, function (event, comment) {
        comment.comment = comment.comment.replace(/@\w+/g, make_hotlink);
        comment.comment = comment.comment.replace(/\n/g, replace_newline);
        $scope.comments.push(comment);
        $scope.comment_count = $scope.comments.length;
      });

      $scope.$on('comment.created.error.' + post_id, function () {
        // vm.columns.shift();
      });

    }

    /**
     * @name like
     * @desc Add like to post
     * @memberOf prism.posts.controllers.PostController
     */
    function like_unlike(id) {
      if ($scope.is_liked == true){
        Posts.unlike($scope.like_id).then(unlikeSuccessFn, unlikeErrorFn);
      } else {
        Posts.like(id).then(likeSuccessFn, likeErrorFn);
      }

      vm.post_id = id;

      /**
       * @name likeSuccessFn
       * @desc Show snackbar with success message
       */
      function likeSuccessFn(data, status, headers, config) {
        $scope.is_liked = true;
        $scope.like_id = data.data.id;
        $scope.like_count = $scope.like_count + 1;
        $(".action-fav-" + $scope.post.id + "").addClass('liked');
        Snackbar.show('Starred!');
      }


      /**
       * @name likeErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function likeErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('post.like.error');
        Snackbar.error(data.error);
      }

      /**
       * @name unlikeSuccessFn
       * @desc Show snackbar with success message
       */
      function unlikeSuccessFn(data, status, headers, config) {
        $scope.is_liked = false;
        $scope.like_count = $scope.like_count - 1;
        $(".action-fav-" + $scope.post.id + "").removeClass('liked');
        Snackbar.show('Un-Starred!');
      }


      /**
       * @name likeErrorFn
       * @desc Propogate error event and show snackbar with error message
       */
      function unlikeErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('post.unlike.error');
        Snackbar.error(data.error);
      }
    }

    function submit() {
      Comments.create($scope.comment, post_id).then(createCommentSuccessFn, createCommentErrorFn);


      /**
      * @name createCommentSuccessFn
      * @desc Show snackbar with success message
      */
      function createCommentSuccessFn(data, status, headers, config) {
        $rootScope.$broadcast('comment.created.' + post_id, {
          comment: $scope.comment,
          author: {
            username: Authentication.getAuthenticatedAccount().username
          },
          post: post_id,
          created_at: new Date()
        });
        Snackbar.show('Success! Comment created.');
        $scope.comment = '';
      }


      /**
      * @name createCommentErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function createCommentErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('comment.created.error.' + post_id);
        Snackbar.error(data.error);
      }
    }

    function cancel(){
      $scope.comment = '';
    }

    function modal_close(){
      $modalInstance.dismiss('close');
      //$location.url("/");
      //$state.go('^');
      if (history.length == 0) {
        $location.url("/");
      } else {
        history.back();
      }
    }

    function key_capture($event){
      //Escape
      if ($event.keyCode == 27) {
        //$modalInstance.dismiss('close');
        //if (history.length == 0){
        //  $location.url("/");
        //} else {
        //  history.back();
        //}
      }
    }

  }
})();