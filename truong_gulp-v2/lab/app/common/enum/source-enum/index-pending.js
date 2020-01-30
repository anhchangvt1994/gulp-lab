"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var APP_SRC_PATH = './src'; // url của source directory (nơi để dev)
var APP_TMP_PATH = './tmp'; // url của temp directory (nơi để built source deploy)
var APP_DIST_PATH = './dist'; // url của dist directory (nơi chứa source production live)

var APP = {
    src: {
        path: APP_SRC_PATH,
        scss: APP_SRC_PATH + '/scss',
        js: APP_SRC_PATH + '/js',
        images: APP_SRC_PATH + '/images',
        njk: APP_SRC_PATH + '/njk',
        data: APP_SRC_PATH + '/data',
    },
    tmp: {
        path: APP_TMP_PATH,
        css: APP_TMP_PATH + '/css',
        js: APP_TMP_PATH + '/js',
        images: APP_TMP_PATH + '/images',
    },
    dist: {
        path: APP_DIST_PATH,
        css: APP_DIST_PATH + '/css',
        js: APP_DIST_PATH + '/js',
        images: APP_DIST_PATH + '/images',
    }
};

exports.default = APP;