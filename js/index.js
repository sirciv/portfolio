// ── 1. SCROLLING LOGO ──────────────────────────────────────────────────────────

var gearlogo = document.getElementById('gearlogo_noflash');

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


// ── 2. SCROLL TO TOP ───────────────────────────────────────────────────────────

function scrollToTop(scrollDuration) {
  var scrollStep = -window.scrollY / (scrollDuration / 15),
      scrollInterval = setInterval(function () {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
}


// ── 3. FREEFORM: MANUAL ATTRIBUTE APPLICATION ────────────────────────────────────────────
//
// Mirrors the applyManualAttrs logic in gallery.js for homepage entries.
// data-w:      explicit width (% or px); height becomes auto
// data-rotate: rotation in degrees
// data-mt:     margin-top in px (negative = overlap/stack)

function applyManualAttrs(entries) {
  entries.forEach(function (entry) {
    if (entry.dataset.w) {
      entry.style.width  = entry.dataset.w;
      entry.style.height = 'auto';
    }
    if (entry.dataset.rotate) {
      entry.style.transform = 'rotate(' + entry.dataset.rotate + 'deg)';
    }
    if (entry.dataset.mt) {
      entry.style.marginTop = entry.dataset.mt + 'px';
    }
  });
}


// ── 4. FREEFORM: HOMEPAGE JUSTIFIED GALLERY ──────────────────────────────────────────────
//
// Same row-fill algorithm as gallery.js but reads aspect ratios from natural
// image dimensions (homepage images have no data-pswp-* attributes).
// Items with data-w are excluded from auto-layout — they use their manual width.
// On mobile (≤1200px) the CSS column layout takes over; JS sizing is cleared.
//
// Flash prevention strategy:
//   1. Apply an immediate first-pass layout using default 1.5 ratios the moment
//      DOMContentLoaded fires — before any images have loaded.
//   2. Fade the gallery in right after that first pass so the unstyled column
//      state is never visible to the user.
//   3. Once all images have loaded and true aspect ratios are known, run one
//      final accurate re-layout.

function justifiedLayout(container, items, targetH, gap) {
  var W = container.offsetWidth;
  if (W === 0) return;

  var row = [], sumRatio = 0;

  function flushRow(isPartial) {
    var gaps      = gap * (row.length - 1);
    var rowHeight = isPartial ? targetH : (W - gaps) / sumRatio;
    row.forEach(function (d) {
      d.el.style.width  = (d.ratio * rowHeight) + 'px';
      d.el.style.height = rowHeight + 'px';
    });
    row = []; sumRatio = 0;
  }

  items.forEach(function (d, i) {
    row.push(d);
    sumRatio += d.ratio;
    var isLast = i === items.length - 1;
    var rowW   = sumRatio * targetH + gap * (row.length - 1);
    if (rowW >= W || isLast) {
      flushRow(isLast && !(rowW >= W) && rowW < W * 0.6);
    }
  });
}

function initIndexGallery() {
  var gallery = document.querySelector('.index-gallery');
  if (!gallery) return;

  var allEntries  = Array.from(gallery.querySelectorAll('.entry'));
  var autoEntries = allEntries.filter(function (e) { return !e.dataset.w; });
  var data        = autoEntries.map(function (e) { return { el: e, ratio: 1.5 }; });

  function doLayout() {
    if (window.innerWidth <= 1200) {
      // Mobile: clear JS sizing — CSS column stacking takes over
      allEntries.forEach(function (e) {
        e.style.width  = '';
        e.style.height = '';
      });
      return;
    }
    justifiedLayout(gallery, data, 260, 8);
    applyManualAttrs(allEntries);
  }

  // ── First pass: layout immediately with default ratios, then reveal ──
  // This runs synchronously before any images load, eliminating the flash.
  doLayout();
  // Two rAFs ensure the browser has committed the layout before fading in,
  // so the transition always animates from opacity:0 → 1 (never skipped).
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      gallery.style.opacity = '1';
    });
  });

  // ── Resize handler (registered once, after first layout) ──
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doLayout, 80);
  });

  // ── Second pass: refine ratios once true image dimensions are known ──
  var pending = autoEntries.length;
  if (pending === 0) return;

  autoEntries.forEach(function (entry, idx) {
    var img = entry.querySelector('img');
    if (!img) { if (--pending === 0) doLayout(); return; }

    function onLoad() {
      if (img.naturalWidth > 0) data[idx].ratio = img.naturalWidth / img.naturalHeight;
      if (--pending === 0) {
        // All ratios are now accurate — one final re-layout
        doLayout();
      }
    }

    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.addEventListener('load',  onLoad);
      img.addEventListener('error', onLoad);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Strip the preload class after the first paint so nav-circle
  // transitions are enabled for hover/active interactions.
  requestAnimationFrame(function () {
    document.body.classList.remove('preload');
  });

  initIndexGallery();
});
