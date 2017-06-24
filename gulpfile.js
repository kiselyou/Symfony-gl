var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');

gulp.task('useref', function(){
  	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'));
});

//lessc app/less/config.less app/css/test.css
//lessc app/less/build.less app/css/theme-iron-war.css
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
		.src('app/patterns/**/*.js')
		.pipe(gulp.dest('dist/patterns'));

	gulp
		.src('app/patterns/**/*.html')
		.pipe(gulp.dest('dist/patterns'));
});

gulp.task('clean:dist', function() {
	return del.sync('dist');
});

gulp.task('build', function (callback) {
	// runSequence('clean:dist', ['useref', 'images', 'fonts', 'models', 'icon'], callback);
	runSequence('clean:dist', ['useref', 'images', 'move'], callback);
});

