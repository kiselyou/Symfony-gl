
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
gulp.task('compile-server', function () {
    return gulp.src(['server.js', 'server/**/*.js'])
        .pipe(gulpSourcemaps.init())
        .pipe(gulpBabel())
        .pipe(gulpConcat('./server.min.js'))
        // .pipe(gulpUglify())
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulp.dest('./'));

    // glob("server.js", function (er, files) {
    //     return browserify({entries: files, extensions: ['.js'], debug: true})
    //         .transform(babelify, {sourceMaps: true})
    //         .bundle()
    //         .pipe(source('server.bundle.js'))
    //         .pipe(gulp.dest("./"));
    // });
});

// Recompiling if was changed server
gulp.task('server-watch', function() {
    gulp.watch(['./server.js', './server/**/*.js'], ['compile-server']);
});

// TODO Compiling client side
