import modules from '@common/define/module-define';
import generatePathUrl from '@common/enum/task-path-enum';
import APP from '@common/enum/source-enum';

import RESOURCE from '@common/config/resource-config';

/* --------------------------------- METHOD --------------------------------- */
//! ANCHOR - move file method
//? sử dụng để move file từ source sang dir khác
interface ArrMoveFilesConfigConstruct {
  'sourcePathUrl': string,
  'targetPathUrl': string,
};

const __moveFiles = function(arrMoveFilesConfig: ArrMoveFilesConfigConstruct) {
  return modules.gulp.src(arrMoveFilesConfig.sourcePathUrl)
    .pipe(modules.plumber())
    .pipe(modules.cached('js'))
    .pipe(modules.dependents())
    .pipe(modules.print(
      filepath => `built: ${filepath}`
    ))
    .pipe(modules.gulp.dest(arrMoveFilesConfig.targetPathUrl));
};

//! ANCHOR - compile js method
//-- compile js tmp execute method
const __compileJsTmp = function(filesbox,done) {
  modules.glob(filesbox, function (err, files) {
    if(err) done(err);
    var filename,foldername;

    var tasks = files.map(function(entry) {
      filename = entry.split('/')[entry.split('/').length - 1];
      foldername = entry.split('/')[entry.split('/').length - 2];

      return modules.browserify({entries: [entry]})
      .transform("babelify",{presets: ['@babel/env']})
      .bundle()
      .pipe(modules.source(filename))
      .pipe(modules.rename(
        foldername!='js' ? foldername + '.js' : filename.replace('.js','') + '.js'
      ))
      .pipe(modules.cached('js'))
      .pipe(modules.dependents())
      .pipe(modules.print(
        filepath => `built: ${filepath}`
      ))
      .pipe(modules.gulp.dest(APP.tmp.js))
      .pipe(modules.browserSync.reload({ stream: true }));
    });

    modules.es.merge(tasks).on('end', done);
  });
};

//-- compile js dist execute method
const __compileJsDist = function(filesbox,done) {
  modules.glob(filesbox, function (err, files) {
    if(err) done(err);
    var filename,foldername;

    var tasks = files.map(function(entry) {
      filename = entry.split('/')[entry.split('/').length - 1];
      foldername = entry.split('/')[entry.split('/').length - 2];

      return modules.browserify({entries: [entry]})
      .transform("babelify",{presets: ['@babel/env']})
      .bundle()
      .pipe(modules.source(filename))
      .pipe(modules.rename(
        foldername!='js' ? foldername + '.js' : filename.replace('.js','') + '.js'
      ))
      .pipe(modules.buffer())
      .pipe(modules.uglify())
      .pipe(modules.gulp.dest(APP.dist.js));
    });

    modules.es.merge(tasks).on('end', done);
  });
};
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

//! ANCHOR - copyImagesTask
//-- copy images to tmp ( chỉ dùng khi build vào tmp folder )
export const copyImagesTask = {
  'name': 'copyImages',
  'init': function() {
    modules.gulp.task('copyImages', function() {
      return modules.gulp.src(APP.src.images + '**/*.{jpg,png,gif,svg,ico}')
      .pipe(modules.plumber())
      .pipe(modules.cached('jpg,png,gif,svg,ico'))
      .pipe(modules.dependents())
      .pipe(modules.copy(
        APP.tmp.images,
        {
          prefix: 2
          /*chúng ta có thể sử dụng gulp.dest để dẫn đến thư mục cần thiết, nếu chưa có thì auto tạo. Mục đích duy nhất để ta sử dụng prefix là để chúng ta xác định số cấp thư mục vào đến thư mục mà ta cần. Bắt đầu tính từ thư mục gốc
            vd: từ FADO_EMAIL-V2 vào dist/images thì phải qua 2 cấp thư mục dist/images
          */
        }
      ))
      .pipe(modules.print(
        filepath => `built: ${filepath}`
      ))
      .pipe(modules.browserSync.reload({ stream: true }));
    });
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
    let arrUrl;
    return modules.gulp.src(APP.src.fonts + '/**/*.{svg,eot,otf,ttf,woff,woff2}')
    .pipe(modules.cached('fonts'))
    .pipe(modules.print((filepath) => {
      arrUrl = filepath.split('\\');
      return modules.ansiColors.green(`built: ${generatePathUrl(arrUrl)}`);
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
    let arrUrl;
    return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
    .pipe(modules.plumber(function(err) {
      console.log(modules.ansiColors.red(err.message));
    }))
    .pipe(modules.cached('scss'))
    .pipe(modules.dependents())
    .pipe(modules.sass())
    .pipe(modules.print(
      (filepath) => {
        arrUrl = filepath.split('\\');
        return modules.ansiColors.green(`built: ${generatePathUrl(arrUrl)}`);
      }
    ))
    .pipe(modules.gulp.dest(APP.tmp.css))
    .pipe(modules.browserSync.reload({ stream: true }));
  });
};

//-- convert sass to css into dist
const _convertSassDistTask = function() {
  modules.gulp.task('sassDist', function() {
    return modules.gulp.src(APP.src.scss + '/*.{scss,css}')
    .pipe(modules.plumber())
    .pipe(modules.sass({ outputStyle: 'compressed' }))
    .pipe(modules.gulp.dest(APP.dist.css));
  });
}

export const convertSassTask = {
  'tmp': {
    'name': 'sassTmp',
    'init': _convertSassTmpTask,
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
const _compileJsTmpTask = function() {
  modules.gulp.task('jsTmp', function(done) {
    __compileJsTmp(APP.src.js + '/**/index.js', done);
  });
};


//-- compile js into dist
const _compileJsDistTask = function() {
  modules.gulp.task('jsDist', function(done) {
    __compileJsDist(APP.src.js + '/**/index.js', done);
  });
};

export const compileJsTask = {
  'tmp': {
    'name': 'jsTmp',
    'init': _compileJsTmpTask,
  },
  'dist': {
    'name': 'jsDist',
    'init': _compileJsDistTask
  }
};

//! ANCHOR - compileJsCommonTask
//-- compile common js into tmp
const _compileJsCommonTmpTask = function() {
  modules.gulp.task('jsCommonTmp', function(done) {
    __compileJsTmp(APP.src.js + 'common.js', done);
  });
};

//-- compile common js into dist
const _compileJsCommonDistTask = function() {
  modules.gulp.task('jsCommonDist', function(done) {
    __compileJsDist(APP.src.js + 'common.js', done);
  });
};

export const compileJsCommonTask = {
  'tmp': {
    'name': 'jsCommonTmp',
    'init': _compileJsCommonTmpTask,
  },
  'dist': {
    'name': 'jsCommonDist',
    'init': _compileJsCommonDistTask,
  }
};

//! ANCHOR - compileJsLibTask
//-- compile lib js into tmp and dist
export const compileJsLibTask  = {
  'tmp': {
    'name': 'jsLibTmp',
    'init': function() {
      modules.gulp.task('jsLibTmp', function() {
        return __moveFiles({
          'sourcePathUrl': APP.src.js + '/libs/*.js',
          'targetPathUrl': APP.tmp.js + '/libs/',
        });
      });
    },
  },
  'dist': {
    'name': 'jsLibDist',
    'init': function() {
      modules.gulp.task('jsLibDist', function() {
        return __moveFiles({
          'sourcePathUrl': APP.src.js + '/libs/*.js',
          'targetPathUrl': APP.dist.js + '/libs/',
        });
      })
    },
  }
};

//! ANCHOR - prettierJsTmpTask
//-- compile lib js into tmp
//? chỉ sử dụng cho js của tmp dir
export const prettierJsTmpTask = {
  'name': 'prettierJsTmp',
  'init': function() {
    modules.gulp.task('prettierJsTmp', function() {
      return modules.gulp.src(APP.tmp.js + '/*.js')
      .pipe(modules.cached('js'))
      .pipe(modules.dependents())
      .pipe(modules.prettier())
      .pipe(modules.print(
        filepath => `prettier js: ${filepath}`
      ))
      .pipe(modules.gulp.dest(APP.tmp.js))
    });
  }
}

//! ANCHOR - convertNunjuckTask
//-- convert nunjuck to html into tmp
const _convertNunjuckTmpTask = function() {
  modules.gulp.task('njkTmp', function() {

    return modules.gulp.src(APP.src.njk + '/*.njk')
    .pipe(modules.data((file) => ({namepage: file.path.split('\\')[file.path.split('\\').length - 1].replace('.njk','')})))
    .pipe(modules.nunjucksRender({
      path: [APP.src.njk],
      ext: '.html',
      data: {
        objGlobal: RESOURCE,
        intRandomNumber : Math.random() * 10
      }
    }))
    .pipe(modules.cached('html'))
    .pipe(modules.dependents())
    .pipe(modules.print(
      filepath => `built: ${filepath}`
    ))
    .pipe(modules.gulp.dest(APP.tmp.path))
    .pipe(modules.browserSync.reload({ stream: true }));
  });
};

//-- convert nunjuck to html into dist
const _convertNunjuckTmpDist = function() {
  modules.gulp.task('njkDist', function() {
    return modules.gulp.src(APP.src.njk + '/*.njk')
    .pipe(modules.nunjucksRender({
      path: [APP.src.njk],
      ext: '.html',
      data : {
        objGlobal: RESOURCE,
        intRandomNumber : Math.random() * 10
      }
    }))
    .pipe(modules.gulp.dest(APP.dist.path));
  });
};

export const convertNunjuckTask = {
  'tmp': {
    'name': 'njkTmp',
    'init': _convertNunjuckTmpTask,
  },
  'dist': {
    'name': 'njkDist',
    'init': _convertNunjuckTmpDist,
  },
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
        notify: {
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
