import gulp = require('gulp');
import del = require('del');
import path = require('path');

import APP from '@common/enum/source-enum';
import './watch-task-interface';
import {
  MUTATION_KEYS,
  WatchTaskStore
} from './store';

// NOTE - Setup valud for 'store-init'
WatchTaskStore.commit(MUTATION_KEYS.set_group_watch_file, function(arrWatchFilesConfig: arrWatchFilesConfigInterface) {
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
});
