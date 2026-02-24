const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("endsWith", (str, suffix) => String(str).endsWith(suffix));

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "auto"],
    widths: [400, 800, 1400, null],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "100vw",
    },
    failOnError: false,
    sharpOptions: {
      animated: true,
    },
  });

  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('styles');
  eleventyConfig.addPassthroughCopy('js');
};
