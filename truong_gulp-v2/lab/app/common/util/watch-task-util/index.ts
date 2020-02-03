import APP from '@common/enum/source-enum';
import { cleanTask, convertSassTask, copyImagesTask, browserSyncTask, copyFontsTask, prettierCssTmpTask, compileJsTask, compileJsCommonTask, compileJsLibTask, prettierJsTmpTask, convertNunjuckTask, prettierHtmlTask } from '@common/util/gulp-task-util';
import gulp = require('gulp');
import del = require('del');
import path = require('path');

/* ---------------------------------- TASK ---------------------------------- */
//! ANCHOR - watchScssTask
//-- watch scss files change task
const _watchScssTask = function() {
  gulp.watch(APP.src.scss + '**/*.scss', gulp.series(
    convertSassTask.tmp.name,
    prettierCssTmpTask.name,
    convertNunjuckTask.tmp.name,
    prettierHtmlTask.tmp.name,
  ));
};

export const watchScssTask = {
  'name': '',
  'init': _watchScssTask,
};

//! ANCHOR  - watchJsTask
//-- watch js files change task
const _watchJsTask = function() {
  gulp.watch(APP.src.js + '**/*.js', gulp.series(
    compileJsTask.tmp.name,
    prettierJsTmpTask.name,
    convertNunjuckTask.tmp.name,
    prettierHtmlTask.tmp.name,
  ));
};

export const watchJsTask = {
  'name': '',
  'init': _watchJsTask,
};

//! ANCHOR  - watchNunjuckTask
//-- watch njk files change task
const _watchNunjuckTask = function() {
  gulp.watch(APP.src.njk + '**/*.njk', gulp.series(
    convertNunjuckTask.tmp.name,
    prettierHtmlTask.tmp.name,
  ));
};

export const watchNunjuckTask = {
  'name': '',
  'init': _watchNunjuckTask,
};

//!TODO - watchFontsTask

//! ANCHOR  - watchImagesTask
//-- watch image files change task
const _watchImagesTask = function() {
  //-- khi rename images
  gulp.watch(APP.src.images + '**/*.{jpg,png,gif,svg,ico}', gulp.series(
    convertNunjuckTask.tmp.name,
    prettierHtmlTask.tmp.name,
  ));

  //-- khi thêm images
  gulp.watch(APP.src.images + '**/*.{jpg,png,gif,svg,ico}',
  {events : ['add','change']},
  gulp.series(
    copyImagesTask.name,
  ));

  //-- khi xóa images
  const watchDelImages = gulp.watch(APP.src.images + '**/*.{jpg,png,gif,svg,ico}');

  watchDelImages.on('unlink', function(filepath) {
    const filePathFromSrc = path.relative(path.resolve('src'),filepath);
    const destFilePath = path.resolve(APP.tmp.path, filePathFromSrc);

    del.sync(destFilePath);
  });
};

export const watchImagesTask = {
  'name': '',
  'init': _watchImagesTask,
};

//! ANCHOR  - watchTmpTask
//-- watch tmp files change task
const _watchTmpTask = function() {
  gulp.task('watch', function() {
    _watchScssTask();
    _watchJsTask();
    _watchNunjuckTask();
    _watchImagesTask();
  });
};

export const watchTmpTask = {
  'name': 'watch',
  'init': _watchTmpTask,
};
/* -------------------------------------------------------------------------- */
