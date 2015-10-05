/*jslint node: true */

'use strict';

var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	minifyCss = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	stylish = require('jshint-stylish'),
	watch = require('gulp-watch');//gulp has its own built in watch function, but that doesn't watch for new or deleted file. The gulp-watch module is more powerful.


//define constants for folders etc
	var DIST_FOLDER = './dist/',
		SASS_SRC_FILES = './src/**/*.scss',
		CSS_DIST_FOLDER = DIST_FOLDER+'css/',
		JS_SRC_FILES = './src/**/*.js',
		JS_DIST_FOLDER = DIST_FOLDER+'js/',
		SOURCEMAP_DIST_FOLDER = 'maps/';//this is relative to the dest folder in the stream

// set up sourcemap options



// set up sass tasks


	// define a named function, so we can assign it to a task, but also pass it into pipe
	// CAN'T SEEM TO GET THIS WORKING IN STREAM?
	// var compileSass = function() {
	// 	return gulp.src(SASS_SRC_FILES)
	// 		.pipe(sass(sassOptions).on('error', sass.logError))
	// 		.pipe(gulp.dest(CSS_DIST_FOLDER))
	// 		.pipe(notify('Compiled sass files'));
	// };
	// gulp.task('compile-sass', compileSass);


	var autoprefixerOptions = {
		browsers: ['last 2 versions'],
		cascade: false
	};

	var sassOptions = {
		errLogToConsole: true
	};

	gulp.task('process-sass', function() {
		return gulp.src(SASS_SRC_FILES)
			.pipe(sourcemaps.init())
			.pipe(sass(sassOptions).on('error', sass.logError))
			.pipe(autoprefixer(autoprefixerOptions))
			.pipe(minifyCss())
			.pipe(sourcemaps.write(SOURCEMAP_DIST_FOLDER))
			.pipe(gulp.dest(CSS_DIST_FOLDER))
			.pipe(notify('Processed sass'));
			//todo minify here
	});


// set up javascript stuff

	// TODO: jshint doesn't report undeclared variables yet?
	// does it abort on fail?
	// define a named function, so we can assign it to a task, but also pass it into pipe
	var checkJshint = function() {
		return gulp.src(JS_SRC_FILES)
			.pipe(jshint())
			.pipe(jshint.reporter(stylish))
			.pipe(jshint.reporter('fail'));
	};
	gulp.task('check-jshint', checkJshint);


	// process-javascript: jshint, minify.
	gulp.task('process-javascript', function() {
		return gulp.src(JS_SRC_FILES)
			.pipe(checkJshint())
			.pipe(gulp.dest(JS_DIST_FOLDER))
			.pipe(notify('javascript processed'));
	});


// set up native watch

	var watchNative = function() {
		gulp.watch(SASS_SRC_FILES, ['compile-sass']);
		gulp.watch(JS_SRC_FILES, ['check-js']);
	};
	gulp.task('watch-native', watchNative);



// set up gulp-watch

	gulp.task('watch-sass', function() {
		watch(SASS_SRC_FILES, function() {
			gulp.start('process-sass');
		});
	});

	gulp.task('watch-javascript', function() {
		watch(JS_SRC_FILES, function() {
			gulp.start('process-javascript');
		});
	});

	//combined watch task
	gulp.task('watch', ['watch-sass', 'watch-javascript']);


