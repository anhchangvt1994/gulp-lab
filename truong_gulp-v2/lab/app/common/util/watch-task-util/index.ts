import APP from '@common/enum/source-enum';
import { cleanTask, convertSassTask, copyImagesTask, browserSyncTask, copyFontsTask, prettierCssTmpTask, compileJsTask, compileJsCommonTask, compileJsLibTask, prettierJsTmpTask, convertNunjuckTask, prettierHtmlTask } from '@common/util/gulp-task-util';
import gulp = require('gulp');
import del = require('del');
import path = require('path');

/* --------------------------------- METHOD --------------------------------- */
//! ANCHOR - __groupWatchFiles
//-- Tạo ra method chứa những task watch có liên quan với nhau, dùng để xử lý 1 gulp task vd gulp task images hay gulp task fonts
interface arrWatchFilesConfigConstruct {
  'sourcePathUrl': string,
  'relativeTaskName': string,
};

const __groupWatchFiles = function(arrWatchFilesConfig: arrWatchFilesConfigConstruct) {
  //-- khi rename files
  gulp.watch(arrWatchFilesConfig.sourcePathUrl, gulp.series(
    convertNunjuckTask.tmp.name,
    prettierHtmlTask.tmp.name,
  ));

  //-- khi thêm files
  gulp.watch(arrWatchFilesConfig.sourcePathUrl,
  {events : ['add','change']},
  gulp.series(
    arrWatchFilesConfig.relativeTaskName,
  ));

  //-- khi xóa files
  const watchDelImages = gulp.watch(arrWatchFilesConfig.sourcePathUrl);

  watchDelImages.on('unlink', function(filepath) {
    const filePathFromSrc = path.relative(path.resolve('src'),filepath);
    const destFilePath = path.resolve(APP.tmp.path, filePathFromSrc);

    del.sync(destFilePath);
  });
};

/* -------------------------------------------------------------------------- */


/* ---------------------------------- TASK ---------------------------------- */
//! ANCHOR - watchScssTask
//-- watch scss files change task
const _watchScssTask = function() {
  gulp.watch(APP.src.scss + '/**/*.scss', gulp.series(
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

//! ANCHOR  - watchFontsTask
//-- watch font files change task
const _watchFontsTask = function() {
  __groupWatchFiles({
    'sourcePathUrl': APP.src.fonts + '/**/*.{svg,eot,otf,ttf,woff,woff2}',
    'relativeTaskName': copyFontsTask.tmp.name,
  });
};

//! ANCHOR  - watchJsTask
//-- watch js files change task
const _watchJsTask = function() {
  gulp.watch(APP.src.js + '/**/*.js', gulp.series(
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

//! ANCHOR  - watchImagesTask
//-- watch image files change task
const _watchImagesTask = function() {
  __groupWatchFiles({
    'sourcePathUrl': APP.src.images + '**/*.{jpg,png,gif,svg,ico}',
    'relativeTaskName': copyImagesTask.name,
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
    _watchFontsTask();
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
