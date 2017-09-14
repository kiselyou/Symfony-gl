import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import gulpLess from 'gulp-less';
import gulpBabel from 'gulp-babel';
import gulpRename from 'gulp-rename';
import gulpUglify from 'gulp-uglify';
import gulpConcat from 'gulp-concat';
import gulpCssnano from 'gulp-cssnano';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpImageMin from 'gulp-imagemin';
import gulpCache from 'gulp-cache';


import glob from 'glob';
import babelify from 'babelify';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import source from 'vinyl-source-stream';

import colors from 'colors/safe';

const TEMP_DIR = './temp';

// ---------------------------------------------------- SERVER START----------------------------------------------------

gulp.task('prepare:prod', ['es6-prod'], function () {
    gulp
        .src(['dev/server/**/*.json'])
        .pipe(gulp.dest('app/server'));
});

// ---------------------------------------------------- SERVER END------------------------------------------------------
// =====================================================================================================================
// ---------------------------------------------------- LESS START------------------------------------------------------

gulp.task('less', function() {
    return gulp.src('./dev/less/bundle.less')
        .pipe(gulpLess())
        .pipe(gulpRename('bundle.min.css'))
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpCssnano())
        .pipe(gulpSourcemaps.write('./maps'))
        .pipe(gulp.dest(TEMP_DIR + '/css'));
});

// ----------------------------------------------------- LESS END ------------------------------------------------------
// =====================================================================================================================
// ---------------------------------------------------- ES6 START ------------------------------------------------------

gulp.task('es6-dev', ['ejs:prepare'], () => {
    return browserify({entries: './dev/js/system.bundle.js', debug: true})
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(gulp.dest(TEMP_DIR + '/js'));
});

gulp.task('es6-prod', ['ejs:prepare'], () => {
    return browserify({entries: './dev/js/system.bundle.js', debug: true})
        .transform(babelify, {sourceMaps: true})
        .bundle()
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(gulpSourcemaps.init())
        .pipe(gulpUglify())
        .pipe(gulpSourcemaps.write('./maps'))
        .pipe(gulp.dest(TEMP_DIR + '/js'));
});

// ------------------------------------------------------ ES6 END-------------------------------------------------------
// =====================================================================================================================
// ---------------------------------------------------- EJS START ------------------------------------------------------

import {
    VIEW_PATH,
    BASE_DIR_VIEW
} from './dev/js/ini/ejs.ini';

gulp.task('ejs:prepare', () => {
    let tmp = {};
    for (let key in VIEW_PATH) {
        if (VIEW_PATH.hasOwnProperty(key)) {
            tmp[key] = fs.readFileSync(BASE_DIR_VIEW + VIEW_PATH[key], 'utf-8');
        }
    }
    if (Object.keys(tmp).length > 0) {
        let json = JSON.stringify(tmp, null, 4);
        let pathBufferEJS = TEMP_DIR + '/ejs.json';
        if (!fs.existsSync(TEMP_DIR)){
            fs.mkdirSync(TEMP_DIR);
        }
        fs.writeFile(pathBufferEJS, json, 'utf8', (error, res) => {
            if (error) {
                console.log(colors.red('Cannot write to a file: ' + pathBufferEJS));
                return;
            }
            console.log(colors.green('List EJS templates were prepared successfully'));
        });
    } else {
        console.log(colors.yellow('List EJS templates is empty'));
    }
});

// ------------------------------------------------------ EJS END-------------------------------------------------------
// =====================================================================================================================

gulp.task('watch', function() {
    gulp.watch(['./dev/js/**/*.js', './views/components/**/*.ejs'], ['es6-dev']);
    gulp.watch('./dev/less/**/*.less', ['less']);
});
