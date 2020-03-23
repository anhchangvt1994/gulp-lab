import APP from '@common/enum/source-enum';
import { cleanTask, convertSassTask, copyImagesTask, browserSyncTask, copyFontsTask, prettierCssTmpTask, compileJsTask, compileJsCommonTask, compileJsLibTask, prettierJsTmpTask, convertNunjuckTask, prettierHtmlTask } from '@common/util/gulp-task-util';
import gulp = require('gulp');
import del = require('del');
import path = require('path');

/* --------------------------------- METHOD --------------------------------- */
//! ANCHOR - __groupWatchFiles
//-- Tạo ra method chứa những task watch có liên quan với nhau, dùng để xử lý 1 gulp task vd gulp task images hay gulp task fonts
interface arrRelativeTaskListConstruct {
  'add'?: any,
  'remove'?: any,
  'other'?: any,
};

interface arrWatchFilesConfigConstruct {
  'sourcePathUrl': string,
  'relativeTaskList': arrRelativeTaskListConstruct,
};

const __groupWatchFiles = function(arrWatchFilesConfig: arrWatchFilesConfigConstruct) {
  //-- khi thêm files
  if(arrWatchFilesConfig.relativeTaskList.add) {
    gulp.watch(arrWatchFilesConfig.sourcePathUrl,
    {events : ['add','change']},
    gulp.series(
      arrWatchFilesConfig.relativeTaskList.add,
    ));
  }

  //-- khi xóa files
  const watchDelFiles = gulp.watch(arrWatchFilesConfig.sourcePathUrl);

  watchDelFiles.on('unlink', function(filepath) {
    const removeTask = arrWatchFilesConfig.relativeTaskList.remove;

    if(
      removeTask &&
      typeof removeTask === 'function'
    ) {
      removeTask(filepath);
    } else {
      const filePathFromSrc = path.relative(path.resolve('src'), filepath);
      const destFilePath = path.resolve(APP.tmp.path, filePathFromSrc);

      del.sync(destFilePath);

      if(typeof removeTask === 'string') {
        gulp.series(
          removeTask,
        );
      }
    }
  });
};

/* -------------------------------------------------------------------------- */


/* ---------------------------------- TASK ---------------------------------- */
//! ANCHOR - watchScssTask
//-- watch scss files change task
const _watchScssTask = function() {
  gulp.watch(APP.src.scss + '/**/*.scss', gulp.series(
    convertSassTask.tmp.name,
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
    'relativeTaskList': {
      'add': copyFontsTask.tmp.name,
    },
  });
};

//! ANCHOR  - watchJsTask
//-- watch js files change task
const _watchJsTask = function() {
  gulp.watch(APP.src.js + '/**/*.js', gulp.series(
    compileJsTask.tmp.name,
  ));

  __groupWatchFiles({
    'sourcePathUrl': APP.src.js + '/**/*.js',
    'relativeTaskList': {
      'remove': function(filePath) {
        let filename = filePath.split('\\').slice(-2)[1];
        const foldername = filePath.split('\\').slice(-2)[0];

        if(
          filename == 'index.js'
        ) {
          filename = foldername + '.js';
          const destFilePath = path.resolve(APP.tmp.path, 'js\\' + filename);

          del.sync(destFilePath);
        }

        compileJsTask.dependent.removeDependentFiles(filename);
      },
    },
  });
};

export const watchJsTask = {
  'name': '',
  'init': _watchJsTask,
};

//! ANCHOR  - watchNunjuckTask
//-- watch njk files change task
const _watchNunjuckTask = function() {
  gulp.watch(APP.src.njk + '/**/*.njk', gulp.series(
    convertNunjuckTask.tmp.name,
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
    'relativeTaskList': {
      'add': copyImagesTask.name,
    },
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
