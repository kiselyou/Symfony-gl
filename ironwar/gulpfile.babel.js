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


// ---------------------------------------------------- SERVER START----------------------------------------------------
// Compiling server side
// It use npm script "package.json"
gulp.task('move-server-dependencies', function () {
    gulp
        .src('dev_server/**/*.json')
        .pipe(gulp.dest('app_server'));
});
// ---------------------------------------------------- SERVER END------------------------------------------------------
// =====================================================================================================================
// ---------------------------------------------------- LESS START------------------------------------------------------
gulp.task('less', function() {
    return gulp.src('./src/less/bundle.less')
        .pipe(gulpLess())
        .pipe(gulpRename('bundle.min.css'))
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpCssnano())
        .pipe(gulpSourcemaps.write('./'))
        .pipe(gulp.dest('./src/static/css'));
});

gulp.task('watch-less', function() {
    gulp.watch('./src/less/**/*.less', ['less']);
});
// ----------------------------------------------------- LESS END-------------------------------------------------------
