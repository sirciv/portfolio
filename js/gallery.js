// ── 1. PHOTOSWIPE ──────────────────────────────────────────────────────────────

import PhotoSwipeLightbox from '../js/photoswipe/dist/photoswipe-lightbox.esm.js';
import PhotoSwipeDynamicCaption from '../js/photoswipe/dist/photoswipe-dynamic-caption-plugin.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallerySelector: '.pswp-gallery',
  childSelector: '.pswp-gallery__item',
  pswpModule: () => import('../js/photoswipe/dist/photoswipe.esm.js'),
  paddingFn: () => ({ top: 30, bottom: 30, left: 70, right: 70 }),
});

const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, { type: 'auto' });
lightbox.init();


// ── 2. SCROLLING LOGO ──────────────────────────────────────────────────────────

var gearlogo = document.getElementById('gearlogo');

;(function () {
  var running = false;
  window.addEventListener('scroll', function () {
    if (running) return;
    running = true;
    requestAnimationFrame(function () {
      if (gearlogo) gearlogo.style.transform = 'rotate(' + (window.pageYOffset / 16) + 'deg)';
      running = false;
    });
  });
})();


// ── 3. FREFFORM: MANUAL ATTRIBUTE APPLICATION ────────────────────────────────────────────
//
// Items with data-w, data-rotate, or data-mt are styled directly.
// data-w:      explicit width (% or px); height becomes auto (natural aspect ratio)
// data-rotate: rotation in degrees
// data-mt:     margin-top in px (negative values create overlap/stack effect)

function applyManualAttrs(items) {
  items.forEach(function (item) {
    if (item.dataset.w) {
      item.style.width      = item.dataset.w;
      item.style.height     = 'auto';
      item.style.flexShrink = '0';
      item.style.flexGrow   = '0';
    }
    if (item.dataset.rotate) {
      item.style.transform = 'rotate(' + item.dataset.rotate + 'deg)';
    }
    if (item.dataset.mt) {
      item.style.marginTop = item.dataset.mt + 'px';
    }
  });
}


// ── 4. FREFFORM: JUSTIFIED ROW LAYOUT ────────────────────────────────────────────────────

function justifiedLayout(container, targetRowHeight, gap) {
  const allItems  = Array.from(container.querySelectorAll(':scope > .pswp-gallery__item'));
  if (!allItems.length) return;

  // Separate: auto-layout items vs. manually-sized items
  const autoItems = allItems.filter(item => !item.dataset.w);

  const W = container.offsetWidth;
  if (W === 0) return;

  const data = autoItems.map(item => {
    const a = item.querySelector('a[data-pswp-width][data-pswp-height]');
    const ratio = a
      ? parseFloat(a.dataset.pswpWidth) / parseFloat(a.dataset.pswpHeight)
      : 1.5;
    return { el: item, ratio };
  });

  let row = [], sumRatio = 0;

  function flushRow(isPartial) {
    const gaps      = gap * (row.length - 1);
    const rowHeight = isPartial ? targetRowHeight : (W - gaps) / sumRatio;
    row.forEach(({ el, ratio }) => {
      el.style.width      = (ratio * rowHeight) + 'px';
      el.style.height     = rowHeight + 'px';
      el.style.flexShrink = '0';
      el.style.flexGrow   = '0';
    });
    row = []; sumRatio = 0;
  }

  data.forEach(({ el, ratio }, i) => {
    row.push({ el, ratio });
    sumRatio += ratio;
    const isLast = i === data.length - 1;
    const rowW   = sumRatio * targetRowHeight + gap * (row.length - 1);
    if (rowW >= W || isLast) {
      // Keep a short trailing row at natural height; don't over-stretch it
      flushRow(isLast && !( rowW >= W ) && rowW < W * 0.6);
    }
  });

  // Apply manual attrs to all items (including auto items — data-rotate / data-mt)
  applyManualAttrs(allItems);
}


// ── 5. FREFFORM: INIT ────────────────────────────────────────────────────────────────────

function initCollageGalleries() {
  const galleries = document.querySelectorAll('.collage-gallery');
  if (!galleries.length) return;

  const ro = new ResizeObserver(entries => {
    entries.forEach(entry => justifiedLayout(entry.target, 280, 6));
  });

  galleries.forEach(gallery => {
    justifiedLayout(gallery, 280, 6);
    ro.observe(gallery);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Strip the preload class after the first paint so nav-circle
  // transitions are enabled for hover/active interactions.
  requestAnimationFrame(function () {
    document.body.classList.remove('preload');
  });

  initCollageGalleries();
});
