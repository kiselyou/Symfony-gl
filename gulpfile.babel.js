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
        .pipe(gulp.dest('./src/css'));
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
        .pipe(gulp.dest('./src/js'));
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
        .pipe(gulp.dest('./src/js'));
});

// ------------------------------------------------------ ES6 END-------------------------------------------------------
// =====================================================================================================================
// ---------------------------------------------------- EJS START ------------------------------------------------------
const fileBufferEJS = 'bufferEJS.json';

import {
    VIEW_PATH,
    BASE_DIR_VIEW,
    TEMP_DIR_VIEW
} from './dev/js/ini/ejs-ini';

gulp.task('ejs:prepare', () => {
    let tmp = {};
    for (let key in VIEW_PATH) {
        if (VIEW_PATH.hasOwnProperty(key)) {
            tmp[key] = fs.readFileSync(BASE_DIR_VIEW + VIEW_PATH[key], 'utf-8');
        }
    }
    if (Object.keys(tmp).length > 0) {
        let json = JSON.stringify(tmp, null, 4);
        let pathBufferEJS = TEMP_DIR_VIEW + '/' + fileBufferEJS;
        if (!fs.existsSync(TEMP_DIR_VIEW)){
            fs.mkdirSync(TEMP_DIR_VIEW);
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
// ---------------------------------------------------- OBJ START ------------------------------------------------------

import {
    BASE_DIR_OBJ,
    TEMP_DIR_OBJ
} from './dev/js/ini/obj.ini';

gulp.task('obj:prepare', () => {
    gulp
        .src([BASE_DIR_OBJ + '/**/*.mtl'])
        .pipe(gulp.dest(TEMP_DIR_OBJ));

    gulp.src(BASE_DIR_OBJ + '/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(gulpCache(gulpImageMin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(TEMP_DIR_OBJ));
});

// ------------------------------------------------------ OBJ END-------------------------------------------------------

gulp.task('watch', function() {
    gulp.watch(['./dev/js/**/*.js', './views/components/**/*.ejs'], ['es6-dev']);
    gulp.watch('./dev/less/**/*.less', ['less']);
});
