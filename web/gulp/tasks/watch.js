/* Watch task */

/**
 * plugins
 */
var gulp = require('gulp'),
  watch = require('gulp-watch');

/**
 * configs
 */
var config = require('../config');

/**
 * Tasks
 */
gulp.task('watch', ['default', 'browsersync'], function () {
  watch(config.scss.glob, function (event) {
    gulp.start('scss');
  });
  watch(config.svg.src, function (event) {
    gulp.start('svg');
  });
});
