'user strict';

$(document).ready(function(){

  //Menu

  $(function() {
    
    // Toggle Nav on Click
    $('.menu-button').on('click', function() {
        toggleNav();
    });

    
  });

  function toggleNav() {

    $('.site').toggleClass('show-nav');
    $('.menu-button').toggleClass('is--active');

    if ($('.site').hasClass('show-nav')) {
      $('.site__inner').append('<div class="overlay"></div>');
      $('.overlay').on('click', function() {
        $('.site').removeClass('show-nav');
        $('.menu-button').removeClass('is--active');
        $(this).remove();
      });
    }

  }

  switchReady(); // Fire switchReady on fresh page load

  // Fastclick Mobile delay

  window.addEventListener('load', function() {
    FastClick.attach(document.body);
  }, false);

});

// Switch content ready

function switchReady() {

 

} // end of switchReady

var MODULE = MODULE || {};
MODULE.ajaxer = (function(){

    var cache = {},
        url,
        $container = $('#switch-cont'),
        $switcher,
        $menuLinks = $('.ocn__list a');
        var $ajaxLinks = $menuLinks;

    function init() {
        if ( history.replaceState ) {
            var url = window.location.href;
            history.replaceState({ path: url }, null, url );
            uiBinding();
        }
    }

    function convertToRel(href) {
        href = href.replace('http://', '');
        href = href.replace(window.location.host + '/', '');
        return href;
    }

    function updateLinks(href, target) {
        href = convertToRel(href);
        // $menuItems.removeClass('is--active');
        // var activeLink = $('a[href="/' + href + '"]', $menuItems);
        // activeLink.closest('.ocn__list__item').addClass('is--active');
        // console.log(activeLink);

    }

    function createHistory(url, title) {
        if ( history.replaceState ) {
            history.pushState({ path: url }, null, url );
            document.title = title;
        }
    }

    function trans(url, target, onpopstate) {
        if (!onpopstate) {
          createHistory(url, cache[url].headerTitle);          
        }
        $switcherContent = $(cache[url].html);
        if ($switcherContent.hasClass('switch-trans')) {
          $switcherContent.addClass('switch-trans-in');
        } else {
          $('.switch-trans', $switcherContent).addClass('switch-trans-in');
        }
        $newSwitcher = $('<div class="switch"></div>');
        $newContainer = $container;

        $newSwitcher.append($switcherContent);
        $('.switch').remove();

        $newContainer.append($newSwitcher);
        $newContainer[0].offsetHeight; // This is to force the dom to redraw with class names before changing again...
        $newContainer.find('.switch-trans').addClass('switch-trans-out');
        updateLinks(url, target);
        $('body').removeClass().addClass(cache[url].bodyClasses);
        // uiContentBinding();
        switchReady();
        NProgress.set(loaded);
    }

    function loader(url, target, onpopstate) {
        $switcher = $container.find('.switch');
        NProgress.start();
        onpopstate = (!onpopstate ? false : true);
        // $('.site').removeClass('ocn-show-right');
        $(".overlay").remove();
        $("html, body").animate({ scrollTop: 0 }, 500);
        // var track = url.split('/');
        // track.splice(0,3);
        // Push to Google Analytics...
        // _gaq.push(['_trackPageview', '/' + track.join('/')]);

        if (typeof cache[url] == "undefined") {
            $.ajax({
                url: url,
                success: function(data){
                  var bodyClasses = data.match(/body class=\"(.*?)\"/)[1]; // Necessary as jQuery can't get the body (or body class) from a string
                  var $data = $(data);
                  
                  var html = $data.find('.switch').html();

                  cache[url] = {
                      headerTitle: $data.filter('title').text(),
                      bodyClasses: bodyClasses,
                      html: html
                  };
                  trans(url, target, onpopstate);
                }
            });
        } else {
            trans(url, target, onpopstate);
        }
    }

    function uiBinding() {

        $ajaxLinks.on('click', function(e){
            e.preventDefault();
            loader(this.href, 'main');
        });

        window.onpopstate = function(e) {
            if (e.state) {
                e.preventDefault();
                loader(e.state.path, 'main', true);
            }
        };
    }

    return {
        init: init
    };

})();

MODULE.ajaxer.init();
