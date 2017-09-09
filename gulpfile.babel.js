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

gulp.task('es6-dev', ['ejs'], () => {
    return browserify({entries: './dev/js/system.bundle.js', debug: true})
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./src/js'));
});

gulp.task('es6-prod', ['ejs'], () => {
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

const tempDir = './temp';
const fileBufferEJS = 'bufferEJS.json';
import {viewPath} from './dev/js/ini/ejs-ini';

gulp.task('ejs', () => {
    let tmp = {};
    for (let key in viewPath) {
        if (viewPath.hasOwnProperty(key)) {
            tmp[key] = fs.readFileSync('views/' + viewPath[key], 'utf-8');
        }
    }

    if (Object.keys(tmp).length > 0) {
        let json = JSON.stringify(tmp, null, 4);

        let pathBufferEJS = tempDir + '/' + fileBufferEJS;

        if (!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir);
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

gulp.task('watch', function() {
    gulp.watch(['./dev/js/**/*.js', './views/components/**/*.ejs'], ['es6-dev']);
    gulp.watch('./dev/less/**/*.less', ['less']);
});
