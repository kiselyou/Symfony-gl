var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var path = require('path');

//
// var ftp = require('vinyl-ftp');
//
// gulp.task('deploy', function() {
// 	var conn = ftp.create( {
// 		host:     'mywebsite.tld',
// 		user:     'me',
// 		password: 'mypass',
// 		parallel: 10,
// 		log: gutil.log
// 	} );
//
// 	var globs =['dist/**/*'];                                   // переменная для пути
//
// 	return gulp.src(globs, {base: 'dist/', buffer: false })     //
// 		.pipe(conn.dest('/var/www/iron-war/'));                         // перемещение
// });

gulp.task('useref', function(){
  	return gulp.src('app/*.html')
        .pipe(useref({
            transformPath: function(filePath) {
                return filePath.replace('/app', '')
            }
        }))
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({
            progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('move', function() {

	gulp.src('app/*.ico')
		.pipe(gulp.dest('dist'));

	gulp.src(
		[
			'app/js/jquery.min.js',
			'app/js/jquery.min.map',
			'app/js/socket.io.js',
			'app/js/socket.io.js.map',
			'app/js/stats.min.js'
		]
	).pipe(gulp.dest('dist/js'));

	gulp.src('app/**/*.json')
		.pipe(gulp.dest('dist'));

	gulp
		.src('app/models/**/*')
		.pipe(gulp.dest('dist/models'));

	gulp
		.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

    gulp
        .src('app/view/**/*')
        .pipe(gulp.dest('dist/view'));

    gulp.src('dist/app/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean:dist', function() {
	return del.sync('dist');
});

gulp.task('clean:app', function() {
    return del.sync('dist/app');
});

//lessc app/less/config.less app/css/test.css
//lessc app/less/build.less app/css/theme-iron-war.css

gulp.task('less', function() {
    return gulp.src('./app/less/theme-iron-war.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less') ]
        }))
        .pipe(gulp.dest('app/css'));
});

gulp.task('watch', function() {
    gulp.watch('./app/less/**/*.less', ['less']);
});

gulp.task('build', function (done) {
	runSequence('clean:dist', 'useref', 'move', 'images', 'clean:app', done);
});
