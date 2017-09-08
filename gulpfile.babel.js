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

const pathBufferEJS = './dev/js/temp/bufferEJS.json';
import {viewPath} from './dev/js/ini/ejs-ini';

// ---------------------------------------------------- SERVER START----------------------------------------------------
// Compiling server side
// It use npm script "package.json"
gulp.task('move-server-dependencies', function () {
    gulp
        .src('dev/server/**/*.json')
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
        .pipe(gulpSourcemaps.write('./'))
        .pipe(gulp.dest('./src/css'));
});
// ----------------------------------------------------- LESS END ------------------------------------------------------
// =====================================================================================================================
// ---------------------------------------------------- ES6 START ------------------------------------------------------

gulp.task('es6', function () {
    glob('dev/js/*.bundle.js', function (er, files) {
        browserify({entries: files, extensions: '.bundle.js'})
            .transform(babelify, {sourceMaps: true})
            .bundle()
            .pipe(source('bundle.min.js'))
            // .pipe(buffer())
            // .pipe(gulpRename('bundle.min.js'))
            // .pipe(gulpSourcemaps.init({loadMaps: true}))
            // .pipe(gulpUglify())
            // .pipe(gulpSourcemaps.write('./'))
            .pipe(gulp.dest('src/js/'));
    });
});
// ------------------------------------------------------ ES6 END-------------------------------------------------------
//######################################################################################################################
gulp.task('ejs', () => {
    let tmp = {};
    for (let key in viewPath) {
        if (viewPath.hasOwnProperty(key)) {
            tmp[key] = fs.readFileSync('views/' + viewPath[key], 'utf-8');
        }
    }

    let json = JSON.stringify(tmp, null, 4);
    fs.writeFile(pathBufferEJS, json, 'utf8', (error, res) => {
        if (error) {
            console.log('Cannot write to the file "' + pathBufferEJS + '"');
            return;
        }
        console.log('Buffer of templates has already created successfully');
    });
});
//######################################################################################################################

gulp.task('watch', function() {
    gulp.watch('./dev/js/**/*.js', ['es6']);
    gulp.watch('./dev/less/**/*.less', ['less']);
});
