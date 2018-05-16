jQuery(document).ready(function(){
    //jQuery.ajax({
    //    beforeSend: function (xhr) { xhr.setRequestHeader ('Authorization', 'Token ebc5bf9b8514b14c561db4286105c5d3671d4b63') },
    //    type: "GET",
    //    url: "http://127.0.0.1:8000/api/v1/comments/",
    //    dataType: "json"
    //}).done(function( msg ) {
    //    console.log( msg );
    //}).fail(function(jqXHR, textStatus, errorThrown) {
    //    console.log( "Request failed: " + textStatus );
    //    console.log( errorThrown );
    //});
    jQuery(document).on("click", ".toggle-btn", function() {
      jQuery(this).parents('.btn-toolbar').find('.toggle-options').toggle();
    });
    var instrumentTextarea = function(textarea) {
      function resizeTextarea(ev) {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 12 + 'px';
      }
      textarea.addEventListener("keyup", resizeTextarea, 0);
    };
    jQuery(document).on("focusin", ".comment-input", function(){
        jQuery(this).parents('.form-group').find('.comment-buttons').show();
        var textareas = jQuery(this);
        for (var i = 0; i < textareas.length; i++) {
            instrumentTextarea(textareas[i]);
        }
    });
    jQuery(document).on("focusout", ".comment-input", function(){
        //if (jQuery(this).parents('.form-group').find('.ta-html').css('display') == 'none') {
        //    jQuery(this).parents('.form-group').find('.comment-buttons').hide();
        //}
    });
    jQuery(document).on("click", ".comment__submit", function(){
        jQuery(this).parents('.form-group').find('.comment-input').height(18);
        jQuery(this).parents('.form-group').find('.comment-input').val("");
    });
    jQuery(document).on("click", "#comments-toggle", function(){
       jQuery(this).toggleClass('active');
        $( ".comments-wrapper" ).slideToggle( "fast", function() {
          // Animation complete.
        });
    });
    jQuery(document).on("click", ".card__comment", function(){
       jQuery(this).toggleClass('active');
       //jQuery(this).parents().eq(2).find('.comments').show();
       
       jQuery(this).parents().eq(3).find('.comments').slideToggle( "fast", function() {
          // Animation complete.
        });
    });
    jQuery(document).on("click", "#upload-toggle", function(){
       jQuery(this).toggleClass('active');
        $( ".upload-toggle-section" ).slideToggle( "slow", function() {
          // Animation complete.
        });
    });
    

   /* jQuery(document).ready(function () {
          
          // hide div first before sliding in
          $( "#add-posts" ).hide();

        //hide a div after 1 second
        setTimeout(function(){

           $("#add-posts").prependTo($('#posts .col-sm-12:first'));
           $("#add-posts" ).showshow();
           $("#add-posts").style("width":'100%');
           $("#upload-dialog-inline" ).slideDown( "slow", function() {
          // Animation complete.
            });
           //$("#upload-dialog-inline").prependTo($('#posts'));

        }, 2000);
    });*/


});

function pageImage(event) {
  // use event.originalEvent.clipboard for newer chrome versions
  var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
  console.log(JSON.stringify(items)); // will give you the mime types
  // find pasted image among pasted items
  var blob = null;
  var element = document.getElementById("pastedImage");
  var form = document.getElementById("new-post-form");
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") === 0) {
      blob = items[i].getAsFile();
    }
  }
  // load image if there is a pasted image
  if (blob !== null) {
    var reader = new FileReader();
    reader.onload = function(event) {
      console.log(event.target.result); // data url!
      element.src = event.target.result;
      var scope = angular.element(form).scope();
      //scope.ngDialog.open({
      //  templateUrl: '/static/templates/posts/new-post.html',
      //  controller:'NewPostController'
      //});
      scope.isClipboard = true;
      scope.$apply();
    };
    reader.readAsDataURL(blob);
  }
}

/* https://github.com/tzuryby/jquery.hotkeys /*
$(window).bind('keydown.ctrl_s keyup.meta_shift_4 keyup.meta_3', function(event) {
    //event.preventDefault();
    alert('test');
});
*/

/* https://github.com/dmauro/Keypress */
/* lister for mac cmd+shft+3, cmd+shft+4 */
/* TODO: Improve support for handling keydown for cmd+shft+4 */

var listener = new window.keypress.Listener();
listener.register_combo({
    "keys"              : "meta shift",
    "on_keydown"    : function() {
        console.log("You pressed shift and cmd together.");
    },
    "on_keyup"      : function(e) {
        console.log("And now you've released one of the keys.");
    },
    "on_release"        : null,
    "this"              : undefined,
    "prevent_default"   : true,
    "prevent_repeat"    : true,
    "is_unordered"      : false,
    "is_counting"       : false,
    "is_exclusive"      : false,
    "is_solitary"       : false,
    "is_sequence"       : false
});

function pageImage1(event) {

}

window.onload = function() {

setTimeout(function(){
  $('.navbar').data('size','big');
  $navHeight = $('.navbar').height();
  //alert($navHeight);
  //$height = 140;
}, 3000);
}

//window.onload = function() {

$(window).scroll(function(){

  if($(document).scrollTop() > 0)
{
    if($('.navbar').data('size') == 'big')
    {
        $('.navbar').data('size','small');
        /*$('.navbar').stop().animate({
            height: '120px'
        },100);*/

        $('#content').css({'padding-top': $navHeight +40 });
        $('.navbar').toggleClass('navbar-scroll');

    }
}
else
  {
    if($('.navbar').data('size') == 'small')
      {
        $('.navbar').data('size','big');
        /*$('.navbar').stop().animate({
            height: $navHeight
        },100);*/

        $('#content').css({'padding-top': '40px'});
        $('.navbar').toggleClass('navbar-scroll');

      }  
  }

});


