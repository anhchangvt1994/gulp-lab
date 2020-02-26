import gulp = require('gulp');
import clean = require('gulp-clean');
import copy = require('gulp-copy');
import sass = require('gulp-sass');

//-- sub dependencies
import plumber = require('gulp-plumber');
import cached = require('gulp-cached');
import changed = require('gulp-changed');
import ansiColors = require('ansi-colors');
import dependents = require('gulp-dependents');
import print = require('gulp-print');
import browserSync = require('browser-sync');
import prettier = require('gulp-prettier');
import glob = require('glob');
import tap = require('gulp-tap');
import split = require('gulp-split-files');
import es = require('event-stream');
import browserify = require('browserify');
import babel = require('gulp-babel');
import bebelMinify = require('gulp-babel-minify');
import gulpBrowserify = require('gulp-browserify');
import babelify = require('babelify');
import source = require('vinyl-source-stream');
import rename = require('gulp-rename');
import buffer = require('vinyl-buffer');
import uglify = require('gulp-uglify');
import data = require('gulp-data');
import nunjucksRender = require('gulp-nunjucks-render');
import del = require('del');
import path = require('path');

export default {
  gulp,
  clean,
  sass,
  copy,

  // sub dependencies
  plumber,
  ansiColors,
  cached,
  changed,
  dependents,
  print: print.default,
  browserSync: browserSync.create(),
  prettier,
  glob,
  tap,
  split,
  es,
  browserify,
  babel,
  bebelMinify,
  gulpBrowserify,
  babelify,
  source,
  rename,
  buffer,
  uglify,
  data,
  nunjucksRender,
  del,
  path,
}
