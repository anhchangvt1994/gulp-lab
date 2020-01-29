/// <reference types="node"/>
declare let APP_SRC_PATH: string; // url của source directory (nơi để dev)
APP_SRC_PATH = './test/';

declare let APP_TMP_PATH: string; // url của temp directory (nơi để built source deploy)
APP_TMP_PATH = './tmp/';
declare let APP_DIST_PATH: string; // url của dist directory (nơi chứa source production live)
APP_DIST_PATH = './dist/';

interface AppItemConstruct {
  path: string,
  scss?: string,
  css?: string,
  js: string,
  images: string,
  njk?: string,
  data?: string,
  urlConfig?: string,
};

interface AppConstruct {
  src: AppItemConstruct,
  tmp: AppItemConstruct,
  dist: AppItemConstruct,
};

declare let APP: AppConstruct;

APP = {
  src: {
    path: APP_SRC_PATH,
    scss : APP_SRC_PATH + 'scss',
    js : APP_SRC_PATH + 'js',
    images : APP_SRC_PATH + 'images',
    njk : APP_SRC_PATH + 'njk',
    data : APP_SRC_PATH + 'data',
    urlConfig : APP_SRC_PATH + 'urlConfig',
  },

  tmp: {
    path : APP_TMP_PATH,
    css : APP_TMP_PATH + 'css',
    js : APP_TMP_PATH + 'js',
    images : APP_TMP_PATH + '/images',
  },

  dist: {
    path : APP_DIST_PATH,
    css : APP_DIST_PATH + 'css',
    js : APP_DIST_PATH + 'js',
    images : APP_DIST_PATH + 'images',
  }
}

export default APP;