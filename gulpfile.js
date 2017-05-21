var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
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

gulp.task('move', function() {

	gulp.src('app/*.ico')
		.pipe(gulp.dest('dist'));

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

