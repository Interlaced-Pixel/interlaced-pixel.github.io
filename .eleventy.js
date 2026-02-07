module.exports = function (eleventyConfig) {
  // copy static assets and admin to output
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('js');
  eleventyConfig.addPassthroughCopy('admin');
  eleventyConfig.addPassthroughCopy('static');

  // plugins
  const pluginRss = require('@11ty/eleventy-plugin-rss');
  eleventyConfig.addPlugin(pluginRss);

  // collections
  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/**/*.md').reverse();
  });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_layouts',
      output: 'public'
    }
  };
};