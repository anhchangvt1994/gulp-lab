const _APP_SRC_PATH: string = './src/'; // url của source directory (nơi để dev)

const _APP_TMP_PATH: string = './tmp/'; // url của temp directory (nơi để built source deploy)

const _APP_DIST_PATH: string = './dist/'; // url của dist directory (nơi chứa source production live)

interface AppItemConstruct {
  path: string,
  scss?: string,
  css?: string,
  js: string,
  images: string,
  fonts: string,
  njk?: string,
  data?: string,
  urlConfig?: string,
};

interface AppConstruct {
  src: AppItemConstruct,
  tmp: AppItemConstruct,
  dist: AppItemConstruct,
};

const APP: AppConstruct = {
  src: {
    path : _APP_SRC_PATH,
    scss : _APP_SRC_PATH + 'scss',
    js : _APP_SRC_PATH + 'js',
    images : _APP_SRC_PATH + 'images',
    fonts : _APP_SRC_PATH + 'fonts',
    njk : _APP_SRC_PATH + 'njk',
    data : _APP_SRC_PATH + 'data',
    urlConfig : _APP_SRC_PATH + 'urlConfig',
  },

  tmp: {
    path : _APP_TMP_PATH,
    css : _APP_TMP_PATH + 'css',
    js : _APP_TMP_PATH + 'js',
    images : _APP_TMP_PATH + 'images',
    fonts : _APP_TMP_PATH + 'fonts',
  },

  dist: {
    path : _APP_DIST_PATH,
    css : _APP_DIST_PATH + 'css',
    js : _APP_DIST_PATH + 'js',
    images : _APP_DIST_PATH + 'images',
    fonts : _APP_DIST_PATH + 'fonts',
  }
};

export default APP;
