
import gulp from 'gulp';
import less from 'gulp-less';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

import glob from 'glob';
import babelify from 'babelify';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';

// Compiling server side
gulp.task('compile-server', function () {
    glob("server.js", function (er, files) {
        return browserify({entries: files, extensions: ['.js'], debug: true})
            .transform(babelify, {sourceMaps: true})
            .bundle()
            .pipe(source('server.bundle.js'))
            .pipe(gulp.dest("./"));
    });
});

// Recompiling if was changed server
gulp.task('server-watch', function() {
    gulp.watch(['./server.js', './server/**/*.js'], ['compile-server']);
});

// TODO Compiling client side
