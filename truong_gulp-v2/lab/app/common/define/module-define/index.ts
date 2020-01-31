const gulp = require('gulp');
const clean = require('gulp-clean');
const copy = require('gulp-copy');
const sass = require('gulp-sass');

//-- sub dependencies
const plumber = require('gulp-plumber');
const cached = require('gulp-cached');
const ansiColors = require('ansi-colors');
const dependents = require('gulp-dependents');
const print = require('gulp-print').default;
const browserSync = require('browser-sync').create();
const prettier = require('gulp-prettier');
const glob = require('glob');
const es = require('event-stream');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');

export default {
  gulp,
  clean,
  sass,
  copy,

  // sub dependencies
  plumber,
  ansiColors,
  cached,
  dependents,
  print,
  browserSync,
  prettier,
  glob,
  es,
  browserify,
  source,
  rename,
}
