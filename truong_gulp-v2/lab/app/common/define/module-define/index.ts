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
import tap = require('gulp-tap');
import es = require('event-stream');
import babel = require('gulp-babel');
import bebelMinify = require('gulp-babel-minify');
import gulpBrowserify = require('gulp-browserify');
import babelify = require('babelify');
import source = require('vinyl-source-stream');
import rename = require('gulp-rename');
import buffer = require('vinyl-buffer');
import uglify = require('gulp-uglify');
import cleanCss = require('gulp-clean-css');
import data = require('gulp-data');
import nunjucksRender = require('gulp-nunjucks-render');
import del = require('del');
import path = require('path');
import emptyDir = require('empty-dir');
import fs = require('fs');
import imageMin = require('gulp-imagemin');
import sassVars = require('gulp-sass-variables');
import tsPathAlias = require('gulp-ts-path-alias');
// import notify = require('gulp-notify');
const notifiter:any = require('node-notifier');
import notifierToaster = require('node-notifier/notifiers/toaster');
// import util = require('gulp-util');

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
  tap,
  es,
  babel,
  bebelMinify,
  gulpBrowserify,
  babelify,
  source,
  rename,
  buffer,
  uglify,
  cleanCss,
  data,
  nunjucksRender,
  del,
  path,
  emptyDir,
  fs,
  imageMin,
  sassVars,
  tsPathAlias,
  // notify,
  notifierToaster,
  // notifiter
  // util,
}
