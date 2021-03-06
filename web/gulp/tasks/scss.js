/* SCSS task */

/**
 * plugins
 */
var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  stylelint = require("stylelint"),
  reporter = require("postcss-reporter"),
  syntax = require("postcss-scss"),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps');

/**
 * configfile
 */
var config = require('../config');

/**
 * Postcss processors
 */
var processors = [
  autoprefixer(config.scss.prefix)
];

/**
 * Tasks
 */
gulp.task("lint-styles", function () {
  gulp.src(config.scss.src)
    .pipe(plumber())
    .pipe(postcss([
      stylelint(config.scss.lint),
      reporter({clearMessages: true})
    ], {syntax: syntax}));
});

gulp.task('scss', function () {
    gulp.src(config.scss.src)
        .pipe(plumber())
        .pipe(sass.sync(config.scss.settings)
            .pipe(sass())
            .on('error', sass.logError))
        .pipe(postcss(processors, {syntax: syntax}))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe(gulp.dest(config.scss.dest))
});

gulp.task('scss-build', ["lint-styles"], function () {
    gulp.src(config.scss.src)
        .pipe(plumber())
        .pipe(sass.sync(config.scss.settings)
            .pipe(sass())
            .on('error', sass.logError))
        .pipe(postcss(processors, {syntax: syntax}))
        .pipe(cssnano({autoprefixer: false}))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe(gulp.dest(config.scss.dest))
});
