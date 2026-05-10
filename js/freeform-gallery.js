// freeform-gallery.js fallback coverage
// Provides a cqw (container query width) fallback for browsers that don't
// support container queries, and applies the correct translate() values.

document.querySelectorAll('.freeform-gallery').forEach(gallery => {
  const containerWidth = gallery.offsetWidth;

  gallery.querySelectorAll('.freeform-item').forEach(item => {
    const style = getComputedStyle(item);
    const x = parseFloat(style.getPropertyValue('--x'));
    const y = parseFloat(style.getPropertyValue('--y'));

    // Only apply fallback if cqw is not supported
    if (!CSS.supports('width', '1cqw')) {
      const tx = (x / 100) * containerWidth;
      const ty = (y / 100) * containerWidth;
      item.style.transform = `translate(${tx}px, ${ty}px)`;
    }
  });
});
