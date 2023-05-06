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