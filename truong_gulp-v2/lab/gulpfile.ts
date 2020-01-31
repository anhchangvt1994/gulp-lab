import 'tsconfig-paths/register';
import { cleanTask, convertSassTask, copyImagesTask, browserSyncTask, copyFontsTask, prettierCssDistTask } from '@common/util/gulp-task-util';
const gulp = require('gulp');

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

//! ANCHOR - prettierCssDist
//-- prettier css in dist
//? chỉ sử dụng prettier css cho source css trong thư mục dist
prettierCssDistTask.init();

//! ANCHOR - copyFontsTask
//-- copy fonts to tmp
copyFontsTask.tmp.init();

//-- copy fonts to dist
copyFontsTask.dist.init();

//! ANCHOR - copyImagesTask
//-- copy images to tmp
//? chỉ dùng khi build vào tmp folder
copyImagesTask.init();

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
    copyImagesTask.name,
  ),
  gulp.parallel(
    browserSyncTask.name,
  )
));

//-- prod script
//? build production
gulp.task('prod', gulp.series(
  gulp.parallel(
    cleanTask.tmp.name,
    cleanTask.dist.name,
  ),
  gulp.parallel(
    convertSassTask.dist.name,
    copyFontsTask.dist.name,
  ),
  gulp.parallel(
    prettierCssDistTask.name,
  ),
));
