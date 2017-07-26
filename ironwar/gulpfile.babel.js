
import gulp from 'gulp';
import less from 'gulp-less';
import gulpBabel from 'gulp-babel';
import gulpRename from 'gulp-rename';
import gulpUglify from 'gulp-uglify';
import gulpConcat from 'gulp-concat';
import gulpSourcemaps from 'gulp-sourcemaps';


import glob from 'glob';
import babelify from 'babelify';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import source from 'vinyl-source-stream';


// Compiling server side
gulp.task('move-server-dependencies', function () {
    gulp
        .src('dev_server/**/*.json')
        .pipe(gulp.dest('app_server'));
});

// Recompiling if was changed server
gulp.task('server-watch', function() {
    gulp.watch(['./server.js', './server/**/*.js'], ['compile-server']);
});

// TODO Compiling client side
