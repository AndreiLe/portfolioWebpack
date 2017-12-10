//load all images in img dir
const requireAllImages = require.context('../assets/img/', true);

//jquery.js
import $ from "../assets/js/jquery-3.2.1.js"
window.jQuery = $;
window.$ = $;
//blazy.min.js
import Blazy from "../assets/js/blazy.min.js";
//browser-detect.js
import {isIE,isEdge} from "../assets/js/browser-detect.js";
//viewportchecker.js
require("expose-loader?$!../assets/js/jquery.viewportchecker.js");


//common.js
;(function() {

  //lazyload img
  new Blazy();

  //smooth scroll to id
  $(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });

  //animate by scroll
    $('.animated').each(function(block){
      // debugger
      let $this = $(this);
      let animate = $this.attr('data-animate') || 'fadeIn';
      let delay = $this.attr('data-delay') || '.2s';
      let duration = $this.attr('data-duration') || '1s';
      let offset = $this.attr('data-offset') || '0';
      this.style.setProperty('animation-delay', delay,'');
      this.style.setProperty('animation-duration', duration,'');
      $this.viewportChecker({
        classToAdd: 'visible ' + animate,
        offset: parseInt(offset),
        repeat: false
      });
    });

  //show by scroll
  showMenuItem('.header-home', '#header-home__logo-img','header-home__logo-img--hide');

  showMenuItem('#used', '#header-home__menu-item-used','header-home__menu-item--hide');
  showMenuItem('#now', '#header-home__menu-item-now','header-home__menu-item--hide');
  showMenuItem('#todo', '#header-home__menu-item-todo','header-home__menu-item--hide');
 
  function showMenuItem(blockId, menuId, removeClass) {
    $(blockId).viewportChecker({
      offset: 200,
      repeat: true,
      callbackFunction: function(elem, action){
        if (action === 'add') {
          $(menuId).removeClass(removeClass).blur();
        }
        if (action === 'remove') {
          $(menuId).addClass(removeClass).blur();
        }
      },
    });
  }

  //fix background attacment fixed bug for ie
  if (isIE || isEdge) {
    $('body').on("mousewheel", function() {
      // remove default behavior
      event.preventDefault();

      //scroll without smoothing
      var wheelDelta = event.wheelDelta;
      var currentScrollPosition = window.pageYOffset;
      window.scrollTo(0, currentScrollPosition - wheelDelta);
    });
  }

  //add neon animation
  $('.header-home__github').hover(function() {
    $('.header-home__h1').removeClass('fadeIn').addClass('header-neon');
  }, function() {
    $('.header-home__h1').removeClass('header-neon');
  });

})();