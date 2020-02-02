const gulp = require('gulp');
const cached = require('gulp-cached');
const clean = require('gulp-clean');
const sass = require('gulp-sass');

// định nghĩa đường dẫn app, common, enum và util
const jsAppPath = './app';
const jsCommonPath = jsAppPath + '/common';
const jsEnumPath = jsCommonPath + '/enum';

// import APP define (define đường dẫn các directory)
const APP = require('./app/common/enum/source-enum/');
const APPTest = new APP();
console.log(APPTest.app);
//========================
//  contruct folder path
//========================
