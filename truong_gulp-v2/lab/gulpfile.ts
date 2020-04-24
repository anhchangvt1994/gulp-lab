import 'tsconfig-paths/register';
import { cleanTask, convertSassTask, copyImagesTask, browserSyncTask, copyFontsTask, prettierCssTmpTask, compileJsTask, convertNunjuckTask, prettierHtmlTask, doAfterBuildTask } from '@common/util/gulp-task-util';
import { watchTmpTask } from '@common/util/watch-task-util';
import gulp = require('gulp');

//! ANCHOR - cleanTask
//-- clean tmp task
cleanTask.tmp.init();

//-- clean dist task
cleanTask.dist.init();

//! ANCHOR - convertSassTask
//-- convert sass to css into tmp
convertSassTask.tmp.init();

//-- convert sass to css into dist
convertSassTask.dist.init();

//! ANCHOR - prettierCssTmpTask
//-- prettier css in dist
//? chỉ sử dụng prettier css cho source css trong thư mục tmp
prettierCssTmpTask.init();

//! ANCHOR - compileJsTask
//-- compile js into tmp
compileJsTask.tmp.init();

//-- compile js into dist
compileJsTask.dist.init();

//! ANCHOR - copyFontsTask
//-- copy fonts to tmp
copyFontsTask.tmp.init();

//-- copy fonts to dist
copyFontsTask.dist.init();

//! ANCHOR - convertNunjuckTask
//-- convert nunjuck to html into tmp
convertNunjuckTask.tmp.init();

//-- convert nunjuck to html into dist
convertNunjuckTask.dist.init();

//! ANCHOR - prettierHtmlTask
//-- prettier html tmp
prettierHtmlTask.tmp.init();

//-- prettier html dist
prettierHtmlTask.dist.init();

//! ANCHOR - copyImagesTask
//-- copy images to tmp
copyImagesTask.tmp.init();

//-- copy images to dist
copyImagesTask.dist.init();

//! ANCHOR  - watchTmpTask
//-- watch tmp files change task
watchTmpTask.init();

//! ANCHOR - doAfterBuildTask
//-- doAfterBuild task
doAfterBuildTask.init();

//! ANCHOR - browserSyncTask
//-- browserSync task
browserSyncTask.init();

//! ANCHOR - task runner
//-- dev script
//? build tmp
gulp.task('dev', gulp.series(
  cleanTask.tmp.name,
  gulp.parallel(
    convertSassTask.tmp.name,
    copyFontsTask.tmp.name,

    gulp.series(
      compileJsTask.tmp.name,
      compileJsTask.endTmp.name,
    ),

    copyImagesTask.tmp.name,
  ),
  convertNunjuckTask.tmp.name,
  // convertNunjuckTask.endTmp.name,
  // doAfterBuildTask.name,
  gulp.parallel(
    watchTmpTask.name,
    browserSyncTask.name,
  )
));

//-- prod script
//? build production
gulp.task('prod', gulp.series(
  gulp.parallel(
    cleanTask.dist.name,
  ),

  gulp.parallel(
    convertSassTask.dist.name,
    copyFontsTask.dist.name,
    copyImagesTask.dist.name,
    compileJsTask.dist.name,
  ),
  convertNunjuckTask.dist.name,
  prettierHtmlTask.dist.name,
));
