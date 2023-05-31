//1. LIGHTBOX INIT

import PhotoSwipeLightbox from '../photoswipe/dist/photoswipe-lightbox.esm.js';
import PhotoSwipeDynamicCaption from '../photoswipe/dist/photoswipe-dynamic-caption-plugin.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallerySelector: '#gallery',
  childSelector: '.pswp-gallery__item',
  pswpModule: () => import('../photoswipe/dist/photoswipe.esm.js'),

  // Optional padding for images,
  paddingFn: (viewportSize) => {
    return {
      top: 30, bottom: 30, left: 70, right: 70
    }
  },
});

const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
  // Plugins options, for example:
  type: 'auto',
});

lightbox.init();

//2. SCROLLING LOGO

var gearlogo = document.getElementById("gearlogo");

;(function() {
    var throttle = function(type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };
    throttle ("scroll", "optimizedScroll");
})();
    
window.addEventListener("optimizedScroll", function() { 
    let speedAdjust = window.pageYOffset / 16;
    gearlogo.style.transform = "rotate("+speedAdjust+"deg)";
});