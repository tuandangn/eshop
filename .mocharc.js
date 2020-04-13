'use strict';

module.exports = {
  diff: true,
  extension: ['js'],
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  spec: 'test/**/*.js',
  watch: true,
  'watch-files': ['src/**/*.js', 'test/**/*.spec.js'],
};