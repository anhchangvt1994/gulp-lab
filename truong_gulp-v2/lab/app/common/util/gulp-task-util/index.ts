import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';

//! tmp task
//-- clean tmp folder
export const cleanTmpTask = {
  'name': 'cleanTmp',
  'init': function() {
    modules.gulp.task('cleanTmp', function() {
      return modules.gulp.src(APP.tmp.path, {read: true, allowEmpty: true})
      .pipe(modules.clean({ force: true }));
    });
  }
};

//-- copy images to tmp ( chỉ dùng khi build vào tmp folder )
export const copyImagesTask = {
  'name': 'copyImages',
  'init': function() {
    modules.gulp.task('copyImages', function() {
      return modules.gulp.src(APP.src.images + '**/*.{jpg,png,gif,svg,ico}')
      .pipe(modules.copy(
        APP.tmp.images,
        {
          prefix: 2
          /*chúng ta có thể sử dụng gulp.dest để dẫn đến thư mục cần thiết, nếu chưa có thì auto tạo. Mục đích duy nhất để ta sử dụng prefix là để chúng ta xác định số cấp thư mục vào đến thư mục mà ta cần. Bắt đầu tính từ thư mục gốc
            vd: từ FADO_EMAIL-V2 vào dist/images thì phải qua 2 cấp thư mục dist/images
          */
        }
      ));
    });
  }
};