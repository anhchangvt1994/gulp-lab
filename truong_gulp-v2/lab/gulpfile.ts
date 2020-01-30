import 'tsconfig-paths/register';
import { cleanTmpTask, copyImagesTask } from '@common/util/gulp-task-util';
const gulp = require('gulp');

//-- clean tmp folder
cleanTmpTask.init();

//-- copy images to tmp ( chỉ dùng khi build vào tmp folder )
copyImagesTask.init();

/*==================================
 * setup gulp task runner
====================================*/
//-- dev script
gulp.task('dev', gulp.series(
  cleanTmpTask.name,
  gulp.parallel(
    copyImagesTask.name,
  ),
));