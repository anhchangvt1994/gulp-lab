import modules from '@common/define/module-define';
import Dependents from '@common/util/dependent-util';
import HandlerErrorUtil from '@common/util/hanlder-report-util';
import APP from '@common/enum/source-enum';
import RESOURCE from '@common/config/resource-config';
import { ARR_TMP_CONSTRUCT, generateTmpDirItemConstruct } from '@common/enum/tmp-directory-enum';
import DATA from '@source-data';
import EVN_APPLICATION from '@common/define/enviroment-define';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';

import GenerateRandom from '@common/enum/random-enum';

import { forIn as _forIn } from 'lodash';

/* ----------------------------- DEFINE VARIABLE ---------------------------- */
// NOTE Các variales dùng để định nghĩa phần cơ bản

const TYPE_FILE_JS = ARR_FILE_EXTENSION.JS;
const TYPE_FILE_CSS = ARR_FILE_EXTENSION.CSS;
const TYPE_FILE_HTML = ARR_FILE_EXTENSION.HTML;
const TYPE_FILE_NJK = ARR_FILE_EXTENSION.NJK;

/* -------------------------------------------------------------------------- */

/* ----------------------------- GLOBAL VARIABLE ---------------------------- */
// NOTE Cứ 10 phút sẽ tự random một version mới để xóa cache
const generateRandomNumber = new GenerateRandom();

let isFirstCompileAll = true;

// NOTE - Định nghĩa project host
let strProjectHostUrl = null;
let strProjectStaticUrl = null;

if(process.env.NODE_ENV === 'dev') {
  strProjectHostUrl = 'http://' + RESOURCE.ip_address + ':' + RESOURCE.port;
  strProjectStaticUrl = 'http://' + RESOURCE.ip_address + ':' + RESOURCE.port;
} else if (process.env.NODE_ENV === 'production') {
  strProjectHostUrl = 'http://' + RESOURCE.host + ':' + RESOURCE.port;
  strProjectStaticUrl = 'http://static.' + RESOURCE.host + ':' + RESOURCE.port;
}
/* -------------------------------------------------------------------------- */

/* --------------------------------- METHOD --------------------------------- */
//! ANCHOR - __moveFiles
//? sử dụng để move file từ source sang dir khác
interface ArrMoveFilesConfigConstruct {
  'sourcePathUrl': string,
  'cacheFileExt'?: string,
  'targetPathUrl': string,
  'compressModule'?: any,
};

const __moveFiles = function(arrMoveFilesConfig: ArrMoveFilesConfigConstruct) {
  if(arrMoveFilesConfig.targetPathUrl.indexOf(APP.tmp.path) === -1) {
    if(arrMoveFilesConfig.compressModule) {
      return modules.gulp.src(arrMoveFilesConfig.sourcePathUrl)
        .pipe(modules.plumber())
        .pipe(arrMoveFilesConfig.compressModule)
        .pipe(modules.gulp.dest(arrMoveFilesConfig.targetPathUrl));
    }

    return modules.gulp.src(arrMoveFilesConfig.sourcePathUrl)
      .pipe(modules.plumber())
      .pipe(modules.gulp.dest(arrMoveFilesConfig.targetPathUrl));
  } else {
    arrMoveFilesConfig.cacheFileExt = arrMoveFilesConfig.cacheFileExt || '';

    return modules.gulp.src(arrMoveFilesConfig.sourcePathUrl)
      .pipe(modules.plumber())
      .pipe(modules.cached(arrMoveFilesConfig.cacheFileExt))
      .pipe(modules.dependents())
      .pipe(modules.print(
        filepath => `copy: ${filepath}`
      ))
      .pipe(modules.gulp.dest(arrMoveFilesConfig.targetPathUrl));
  }
};

//! ANCHOR - update sass cache version
// const __setEnvCacheVersion = function() {
//   // NOTE - Init tạo cache version cho sass
//   modules.gulp.src(APP.src.scss + '/var/_root-env.scss')
//   .pipe(modules.rename(function(path) {
//     path.basename = '_env';
//   }))
//   .pipe(modules.gulp.dest(APP.src.scss + '/var/'));
// };

const __initCacheVersion = function() {
  console.log(modules.ansiColors.blueBright(`update new Sass cache version: ${generateRandomNumber.version}`));
  console.log(modules.ansiColors.blueBright(`update new Nunjucks cache version: ${generateRandomNumber.version}`));
};

/* ------------------------------- INIT METHOD ------------------------------ */
// __setEnvCacheVersion();

// NOTE Update new cache versioh mỗi 10 phút
setInterval(function() {
  generateRandomNumber.updateVersion();

  __initCacheVersion();
}, 600000);

//! ANCHOR - handler report error
//? method khai báo __handlerErrorUtil = new HandlerErrorUtil() dùng để xử lý error callback hoặc đưa vào danh sách các errors cần in cuối bảng, hoặc in trực tiếp error hiện tại
const __handlerErrorUtil = new HandlerErrorUtil();
/* -------------------------------------------------------------------------- */

/* ---------------------------------- TASK ---------------------------------- */
//! ANCHOR - cleanTask
//-- clean tmp task
const _cleanTmpTask = function() {
  modules.gulp.task('cleanTmp', function() {
    return modules.gulp.src(APP.tmp.path, {read: true, allowEmpty: true})
    .pipe(modules.clean({ force: true }));
  });
};

//-- clean dist task
const _cleanDistTask = function() {
  modules.gulp.task('cleanDist', function() {
    return modules.gulp.src(APP.dist.path, {read: false, allowEmpty: true})
    .pipe(modules.clean({ force: true }));
  });
};

export const cleanTask = {
  'tmp': {
    'name': 'cleanTmp',
    'init': _cleanTmpTask,
  },
  'dist': {
    'name': 'cleanDist',
    'init': _cleanDistTask,
  }
};

//! ANCHOR - copyImagesTmpTask
//-- copy images to tmp ( chỉ dùng khi build vào tmp folder )
const _copyImagesTmpTask = function() {
  modules.gulp.task('copyImagesTmp', function() {
    return modules.gulp.src(APP.src.images + '/**/*.{jpg,png,gif,svg,ico}')
    .pipe(modules.plumber())
    .pipe(modules.cached('jpg,png,gif,svg,ico'))
    .pipe(modules.print(
      filepath => {
        return modules.ansiColors.green(`copy image: ${filepath}`);
      }
    ))
    .pipe(modules.copy(
      APP.tmp.images,
      {
        prefix: 2
        /*chúng ta có thể sử dụng gulp.dest để dẫn đến thư mục cần thiết, nếu chưa có thì auto tạo. Mục đích duy nhất để ta sử dụng prefix là để chúng ta xác định số cấp thư mục vào đến thư mục mà ta cần. Bắt đầu tính từ thư mục gốc
          vd: từ FADO_EMAIL-V2 vào dist/images thì phải qua 2 cấp thư mục dist/images
        */
      }
    ))
    .pipe(modules.browserSync.reload({ stream: true }));
  });
};

//! ANCHOR - copyImagesDistTask
//-- copy images to dist ( chỉ dùng khi build vào dist folder )
const _copyImagesDistTask = function() {
  modules.gulp.task('copyImagesDist', function() {
    return modules.gulp.src(APP.src.images + '/**/*.{jpg,png,gif,svg,ico}')
    .pipe(modules.imageMin([
      modules.imageMin.gifsicle({interlaced: true}),
      modules.imageMin.mozjpeg({quality: 80, progressive: true}),
      modules.imageMin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(modules.gulp.dest(APP.dist.images));
  });
};

export const copyImagesTask = {
  'tmp': {
    'name': 'copyImagesTmp',
    'init': _copyImagesTmpTask,
  },
  'dist': {
    'name': 'copyImagesDist',
    'init': _copyImagesDistTask,
  }
};

//! ANCHOR - copyFontsTask
//-- copy fonts to tmp vs dist
interface ArrTaskConfigConstruct {
  'name': string,
  'pathUrl': string,
};

const _copyFontsTask = function(arrTaskConfig: ArrTaskConfigConstruct) {
  modules.gulp.task(arrTaskConfig.name, function() {
    return modules.gulp.src(APP.src.fonts + '/**/*.{svg,eot,otf,ttf,woff,woff2}')
    .pipe(modules.cached('fonts'))
    .pipe(modules.print((filepath) => {
      return modules.ansiColors.green(`copy font: ${filepath}`);
    }))
    .pipe(modules.copy(
      //? vì cấu trúc copy fonts của tmp và dist giống nhau, chỉ khác đường dẫn đích nên sẽ sử dụng chung cấu trúc, chỉ thay đổi đường dẫn đích nhận tham số truyền vào
      arrTaskConfig.pathUrl,
      {
        prefix: 2
      }
    ))
    .pipe(modules.browserSync.reload({ stream: true }));
  });
};

export const copyFontsTask = {
  'tmp': {
    'name': 'copyFontsTmp',
    'init': function() {
      _copyFontsTask({
        'name': 'copyFontsTmp',
        'pathUrl': APP.tmp.fonts,
      });
    },
  },
  'dist': {
    'name': 'copyFontsDist',
    'init': function() {
      _copyFontsTask({
        'name': 'copyFontsDist',
        'pathUrl': APP.dist.fonts,
      });
    }
  }
};

//! ANCHOR - convertSassTask
//-- convert sass to css into tmp
const _convertSassTmpTask = function() {
  modules.gulp.task('sassTmp', function() {
    let _isError = false;

    return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
    .pipe(modules.cached('scss'))
    .pipe(modules.dependents())
    .pipe(modules.print(
      (filepath) => {
        if(filepath.indexOf('_env.scss') !== -1) {
          return modules.ansiColors.blueBright(`update new sass cache version: ${generateRandomNumber.version}`);
        }

        return modules.ansiColors.yellow(`compile sass: ${filepath}`);
      }
    ))
    .pipe(modules.sassVars({
      '$var-cache-version': generateRandomNumber.version,
    }))
    .pipe(modules.sass.sync(
      {
        errLogToConsole: false,
      }
    ))
    .on('error', function(err) {
      _isError = true;
      __handlerErrorUtil.handlerError(err, TYPE_FILE_CSS, isFirstCompileAll);

      if(!isFirstCompileAll) {
        __handlerErrorUtil.reportError();
      }

      this.emit('end');
    })
    .pipe(modules.rename(function(path) {
      // NOTE đưa tất cả các file về cấp folder root của nó (ở đây là css)
      path.dirname = '';

      // NOTE Nếu construct CSS đối với path file name hiện tại đang rỗng thì nạp vào
      if(!ARR_TMP_CONSTRUCT[TYPE_FILE_CSS][path.basename]) {
        ARR_TMP_CONSTRUCT[TYPE_FILE_CSS][path.basename] = generateTmpDirItemConstruct({
          'file-name': path.basename,
          'file-path': APP.tmp.css + '/' + path.basename,
        });
      }

      if(!isFirstCompileAll) {
        // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
        __handlerErrorUtil.checkClearError(_isError, TYPE_FILE_CSS);
        __handlerErrorUtil.reportError();
        __handlerErrorUtil.notifSuccess();

        _isError = false;

        modules.fs.writeFile(APP.src.data + '/tmp-construct-log.json', JSON.stringify(ARR_TMP_CONSTRUCT), (err) => {
          if(err) throw err;

          console.log('write file: "tmp-construct-log.json" finish.');
        });
      }
    }))
    .pipe(modules.gulp.dest(APP.tmp.css))
    .pipe(modules.browserSync.reload({ stream: true }));
  });

  // NOTE xử lý phụ sau khi sass compile finish
  modules.gulp.task('sassEndTmp', function(cb) {
    cb();
  })
};

//-- convert sass to css into dist
const _convertSassDistTask = function() {
  // NOTE Nếu trong tmp có sẵn folder css thì bê từ tmp sang, không phải compile lại nữa
  modules.gulp.task('sassDist', function() {
    if(ARR_TMP_CONSTRUCT[TYPE_FILE_JS]) {
      return __moveFiles({
        'sourcePathUrl': APP.tmp.css + '/*.' + TYPE_FILE_CSS,
        'targetPathUrl': APP.dist.css,
        'compressModule': modules.cleanCss({compatibility: 'ie8'}),
      });
    } else {
      return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
      .pipe(modules.plumber())
      .pipe(modules.sass({ outputStyle: 'compressed' }))
      .pipe(modules.rename(
        {
          'dirname' : '',
        }
      ))
      .pipe(modules.gulp.dest(APP.dist.css));
    }
  });
}

export const convertSassTask = {
  'tmp': {
    'name': 'sassTmp',
    'init': _convertSassTmpTask,
  },
  'endTmp': {
    'name': 'sassEndTmp'
  },
  'dist': {
    'name': 'sassDist',
    'init': _convertSassDistTask,
  },
};

//! ANCHOR - prettierCssTmpTask
//-- prettier css in dist
//? chỉ sử dụng prettier css cho source css trong thư mục tmp
export const prettierCssTmpTask = {
  'name': 'prettierCssTmp',
  'init': function() {
    modules.gulp.task('prettierCssTmp', function() {
      return modules.gulp.src(APP.tmp.css + '*.css')
      .pipe(modules.cached('scss'))
      .pipe(modules.dependents())
      .pipe(modules.prettier({
        singleQuote: true
      }))
      .pipe(modules.print(
        filepath => `prettier css: ${filepath}`
      ))
      .pipe(modules.gulp.dest(APP.tmp.css))
    });
  }
};

//! ANCHOR - compileJsTask
//-- compile js into tmp
const JsDependents = new Dependents('js');

const _compileJsTmpTask = function() {
  modules.gulp.task('jsTmp', function() {
    let _isError = false;

    let _arrJsErrorFileList = [];

    return modules.gulp.src(APP.src.js + '/**/*.js')
    .pipe(modules.plumber({
      'errorHandler': function(err) {
        _arrJsErrorFileList.push(err.fileName);
      },
    }))
    .pipe(modules.cached('.js'))
    .pipe(modules.eslint())
    .pipe(modules.eslint.failOnError())
    .on('error', function(err) {
      _isError = true;
      __handlerErrorUtil.handlerError(err, TYPE_FILE_JS, isFirstCompileAll);

      if(!isFirstCompileAll) {
        __handlerErrorUtil.reportError();
      }

      this.emit('end');
    })
    .pipe(modules.tap(function(file) {
      const filePath = file.path.replace(/\\/g, '/');
      // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
      const filename = filePath.split('/').slice(-2)[1];
      const foldername = filePath.split('/').slice(-2)[0];

      let filePathData = null;

      if(
        filename === 'index.js' ||
        foldername === 'js'
      ) {
        // NOTE Khi một file index thay đổi thì nó sẽ tự build lại, nên trong xử lý dependent chỉ update lại các dependents file của file index đó, chứ hok return ra mảng index cần build lại
        filePathData = JsDependents.generate({
          'folder-name': foldername,
          'path': file.path,
          'file-name': filename,
          'content': file.contents,
        });
      } else {
        filePathData = JsDependents.generate({
          'folder-name': foldername,
          'file-name': filename,
          'content': file.contents,
        });
      }

      const strErrKey = (filename === 'index.js' ? foldername + '.js' : filename);

      if(!isFirstCompileAll) {
        // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
        __handlerErrorUtil.checkClearError(_isError, TYPE_FILE_JS, strErrKey);
        __handlerErrorUtil.reportError();
        __handlerErrorUtil.notifSuccess();

        _isError = false;
      }

      if(filePathData) {
        filePathData.forEach(function(strFilePath) {
          modules.gulp.src(strFilePath)
          .pipe(modules.print(
            filepath => {
              return modules.ansiColors.yellow(`compile js: ${filepath}`);
            }
          ))
          .pipe(
            modules.gulpBrowserify(
            {
              transform: modules.babelify.configure({
                presets: ["@babel/env"],
                plugins: [
                  ['module-resolver', {
                    "alias": {
                      "~jsPath": './src/js',
                      "~jsPartialPath": './src/js/partial',
                    }
                  }]
                ]
              }),
            })
          )
          .on('error', function(err) {
            this.emit('end');
          })
          .pipe(modules.rename(function(path) {
            path.basename = (foldername!=='js' ? foldername : filename.replace('.js', ''));

            // NOTE Nếu construct JS đối với path file name hiện tại đang rỗng thì nạp vào
            if(!ARR_TMP_CONSTRUCT[TYPE_FILE_JS][path.basename]) {
              ARR_TMP_CONSTRUCT[TYPE_FILE_JS][path.basename] = generateTmpDirItemConstruct({
                'file-name': path.basename,
                'file-path': APP.tmp.js + '/' + path.basename,
              });
            }

            if(!isFirstCompileAll) {
              modules.fs.writeFile(APP.src.data + '/tmp-construct-log.json', JSON.stringify(ARR_TMP_CONSTRUCT), (err) => {
                if(err) throw err;

                console.log('write file: "tmp-construct-log.json" finish.');
              });
            }
          }))
          .pipe(
            modules.gulp.dest(APP.tmp.js)
          );
        });
      }
    }))
  });
};

//-- end compile js tmp
const _endCompileJsTmpTask = function() {
  // NOTE xử lý phụ sau khi js compile finish
  modules.gulp.task('jsEndTmp', function(cb) {
    // NOTE Đánh dấu lượt compile đầu tiên đã hoàn thành
    if(JsDependents.isFirstCompile) {
      JsDependents.isFirstCompile = false;
    }

    cb();
  });
};

//-- compile js into dist
const _compileJsDistTask = function() {
  modules.gulp.task('jsDist', function() {
    if(ARR_TMP_CONSTRUCT[TYPE_FILE_JS]) {
      return __moveFiles(
        {
          'sourcePathUrl': APP.tmp.js + '/*.' + TYPE_FILE_JS,
          'targetPathUrl': APP.dist.js,
          'compressModule': modules.uglify(),
        }
      );
    } else {
      return modules.gulp.src(APP.src.js + '/**/*.js')
      .pipe(modules.tap(function(file) {

        const filePath = file.path.replace(/\\/g, '/');
        // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
        const filename = filePath.split('/').slice(-2)[1];
        const foldername = filePath.split('/').slice(-2)[0];

        if(
          filename === 'index.js' ||
          foldername === 'js'
        ) {
          // NOTE Nếu là file index hoặc file thuộc folder js cấp đầu tiên thì mới thực hiện compile
          modules.gulp.src(file.path)
          .pipe(modules.gulpBrowserify(
            {
              transform: modules.babelify.configure({
                presets: ["@babel/env"]
              }),
            }
          ))
          .pipe(modules.rename(
            foldername!='js' ? foldername + '.js' : filename.replace('.js','') + '.js'
          ))
          .pipe(modules.uglify())
          .pipe(
            modules.gulp.dest(APP.dist.js)
          );
        }
      }))
    }
  });
};

export const compileJsTask = {
  'tmp': {
    'name': 'jsTmp',
    'init': _compileJsTmpTask,
  },
  'endTmp': {
    'name': 'jsEndTmp',
    'init': _endCompileJsTmpTask,
  },
  'dist': {
    'name': 'jsDist',
    'init': _compileJsDistTask,
  },
  'dependent': JsDependents,
};

//! ANCHOR - convertNunjuckTask
//-- convert nunjuck to html into tmp
const NjkDependents = new Dependents('njk');

const _convertNunjuckTmpTask = function() {
  modules.gulp.task('njkTmp', function() {
    let _isError = false;

    return modules.gulp.src(APP.src.njk + '/**/*.njk')
    .pipe(modules.cached('.njk'))
    .pipe(modules.tap(function(file) {
      const filePath = file.path.replace(/\\/g, '/');

      // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file njk phía tmp
      const filename = filePath.split('/').slice(-2)[1];
      const foldername = filePath.split('/').slice(-2)[0];

      let filePathData = null;

      if(filename === 'index.njk') {
        // NOTE Khi một file index thay đổi thì nó sẽ tự build lại, nên trong xử lý dependent sẽ update lại các dependents file của file index đó
        filePathData = NjkDependents.generate({
          'folder-name': foldername,
          'path': file.path,
          'file-name': filename,
          'content': file.contents,
        });
      } else {
        filePathData = NjkDependents.generate({
          'folder-name': foldername,
          'file-name': filename,
          'content': file.contents,
        });
      }

      if(
        filePathData &&
        filePathData.length > 0
      ) {
        filePathData.forEach(function(indexPath) {
          indexPath = indexPath.replace(/\\/g, '/');
          const foldername = indexPath.split('/').slice(-2)[0];

          modules.gulp.src(indexPath)
          .pipe(modules.print(
            filepath => {
              return modules.ansiColors.yellow(`convert njk: ${filepath}`);
            }
          ))
          .pipe(modules.data((file) => {
            const filePath = file.path.replace(/\\/g, '/');

            return {
              file: filePath.split('/')[filePath.split('/').length - 2],
              namepage: filePath.split('/')[filePath.split('/').length - 2],
              data: DATA,
              CACHE_VERSION: generateRandomNumber.version,
              EVN_APPLICATION: EVN_APPLICATION.dev,
              LAYOUT_CONFIG: {
                'imageUrl' : strProjectStaticUrl + '/image', // NOTE - Vì image sử dụng trong layout config cho những file render numjuck sang html thường có dạng '{{ LAYOUT_CONFIG.imageUrl }}/fantasy-image08.jpg' nên để dev tự thêm / sẽ clear hơn khi sử dụng với nunjuck
                'cssUrl' : strProjectStaticUrl + '/css/',
                'jsUrl' : strProjectStaticUrl + '/js/',
              }
            }
          }))
          .pipe(modules.nunjucksRender({
            ext: '.html',
            data: {
              objGlobal: RESOURCE,
              intRandomNumber : Math.random() * 10
            }
          }))
          .on('error', function(err) {
            _isError = true;
            __handlerErrorUtil.handlerError(err, TYPE_FILE_NJK, isFirstCompileAll);

            if(!isFirstCompileAll) {
              __handlerErrorUtil.reportError();
            }

            this.emit('end');
          })
          .pipe(modules.rename(function(path) {
            path.basename = foldername;

            // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
            if(!isFirstCompileAll) {
              const strErrKey = path.basename + '.' + TYPE_FILE_NJK;
              // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
              __handlerErrorUtil.checkClearError(_isError, TYPE_FILE_NJK, strErrKey);
              __handlerErrorUtil.reportError();
              __handlerErrorUtil.notifSuccess();

              _isError = false;
            }

            // NOTE Nếu construct HTML đối với path file name hiện tại đang rỗng thì nạp vào
            if(!ARR_TMP_CONSTRUCT[TYPE_FILE_HTML][path.basename]) {
              ARR_TMP_CONSTRUCT[TYPE_FILE_HTML][path.basename] = generateTmpDirItemConstruct({
                'file-name': path.basename,
                'file-path': APP.tmp.path + '/' + path.basename,
              });
            }

            if(!isFirstCompileAll) {
              modules.fs.writeFile(APP.src.data + '/tmp-construct-log.json', JSON.stringify(ARR_TMP_CONSTRUCT), (err) => {
                if(err) throw err;

                console.log('write file: "tmp-construct-log.json" finish.');
              });
            }
          }))
          .pipe(modules.gulp.dest(APP.tmp.path))
          .pipe(modules.browserSync.reload({ stream: true }));
        });
      }
    }));
  });

  // NOTE xử lý phụ sau khi nunjucks convert finish
  modules.gulp.task('njkEndTmp', function(cb) {
    if(NjkDependents.isFirstCompile) {
      NjkDependents.isFirstCompile = false;
    }

    cb();
  });
}

//-- convert nunjuck to html into dist
const _convertNunjuckDistTask = function() {
  modules.gulp.task('njkDist', function() {
    return modules.gulp.src(APP.src.njk + '/**/*.njk')
    .pipe(modules.tap(function(file) {
      const filePath = file.path.replace(/\\/g, '/');

      // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file njk phía tmp
      const filename = filePath.split('/').slice(-2)[1];
      const foldername = filePath.split('/').slice(-2)[0];

      if(filename === 'index.njk') {
        modules.gulp.src(file.path)
        .pipe(modules.data((file) => {
          const filePath = file.path.replace(/\\/g, '/');

          return {
            file: filePath.split('/')[filePath.split('/').length - 2],
            namepage: filePath.split('/')[filePath.split('/').length - 2],
            data: DATA,
            CACHE_VERSION: generateRandomNumber.version,
            EVN_APPLICATION: EVN_APPLICATION.dev,
            LAYOUT_CONFIG: {
              'imageUrl' : strProjectStaticUrl + '/image',
              'cssUrl' : strProjectStaticUrl + '/css/',
              'jsUrl' : strProjectStaticUrl + '/js/',
            }
          }
        }))
        .pipe(modules.nunjucksRender({
          ext: '.html',
          data: {
            objGlobal: RESOURCE,
            intRandomNumber : Math.random() * 10
          }
        }))
        .pipe(modules.rename(function(path) {
            path.basename = foldername;
          }
        ))
        .pipe(modules.print(
          filepath => `built: ${filepath}`
        ))
        .pipe(modules.gulp.dest(APP.dist.path));
      }
    }));
  });
};

export const convertNunjuckTask = {
  'tmp': {
    'name': 'njkTmp',
    'init': _convertNunjuckTmpTask,
  },
  'endTmp': {
    'name': 'njkEndTmp',
  },
  'dist': {
    'name': 'njkDist',
    'init': _convertNunjuckDistTask,
  },
  'dependent': NjkDependents,
};

//! ANCHOR - prettierHtmlTask
//-- prettier html tmp
const _prettierHtmlTmpTask = function() {
  modules.gulp.task('prettierHtmlTmp', function() {
    return modules.gulp.src(APP.tmp.path + '*.html')
    .pipe(modules.prettier({
      singleQuote: true
    }))
    .pipe(modules.gulp.dest(APP.tmp.path))
  });
};

//-- prettier html dist
const _prettierHtmlDistTask = function() {
  modules.gulp.task('prettierHtmlDist', function() {
    return modules.gulp.src(APP.dist.path + '*.html')
    .pipe(modules.prettier({
      singleQuote: true
    }))
    .pipe(modules.gulp.dest(APP.dist.path))
  });
};

export const prettierHtmlTask = {
  'tmp': {
    'name': 'prettierHtmlTmp',
    'init': _prettierHtmlTmpTask,
  },
  'dist': {
    'name': 'prettierHtmlDist',
    'init': _prettierHtmlDistTask,
  },
};

//! ANCHOR - doAfterBuildTask
export const doAfterBuildTask = {
  'name': 'doAfterBuildTask',
  'init': function() {
    modules.gulp.task('doAfterBuildTask', function(cb) {
      // NOTE ghi nhận lượt buid đầu tiên đã xong
      isFirstCompileAll = false;

      // NOTE ghi file "tmp-construct-log.json" sau khi lượt build task đầu tiên hoàn thành
      modules.fs.writeFile(APP.src.data + '/tmp-construct-log.json', JSON.stringify(ARR_TMP_CONSTRUCT), (err) => {
        if(err) throw err;

        console.log('write file: "tmp-construct-log.json" finish.');
      });

      // NOTE Sau khi build xong lượt đầu thì forEach để in error ra nếu có
      if(__handlerErrorUtil.arrError) {
        setTimeout(function() {
          __handlerErrorUtil.reportError();
          __handlerErrorUtil.notifSuccess();
        }, 1500);
      }

      cb();
    });
  }
};

//! ANCHOR - browserSyncTask
//-- browserSync task
//? sử dụng để sync result lên browser khi code
export const browserSyncTask = {
  'name': 'browserSync',
  'init': function() {
    modules.gulp.task("browserSync", function() {
      return modules.browserSync.init({
        reloadDelay: 300, // Fix htmlprocess watch not change
        open: false, // Stop auto open browser
        cors: false,
        port: RESOURCE.port,
        host: RESOURCE.host,
        notifier: {
          styles: [
            "display: none; ",
            "padding: 5px 5px;",
            "position: fixed;",
            "font-size: 13px;",
            "line-height: 18px;",
            "z-index: 999999;",
            "left: 0;",
            "top: 0;",
            "width: auto;",
            "max-width: 100%",
            "color: #fff;",
            "background-color: rgba(0,0,0,0.5);",
            "box-shadow: 0 0 5px rgba(0,0,0,0.3);"
          ]
        },
        server: {
          baseDir: APP.tmp.path,
          index: "index.html"
        }
      }); // end modules.browserSync
    }); // end modules.gulp
  },
};
/* -------------------------------------------------------------------------- */
