'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var glob = require('glob');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');

// add custom browserify options here
var customOpts = {
  entries: glob.sync('./scripts/**/*.js'),
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 
var c = browserify(opts);
// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
//b.on('update', bundle); // on any dep update, runs the bundler
//b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return c.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('./bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
	.pipe(uglify())
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('.'));
}

gulp.task('work', work);
function work(){
	bundle();
	b.on('update', bundle); // on any dep update, runs the bundler
	b.on('log', gutil.log); // output build logs to terminal
	gulp.watch('./sass/**/*.scss', ['sass']);
}

gulp.task('sass',compileSass);
function compileSass(){
	gulp.src('./sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(uglifycss())
		.pipe(gulp.dest('.'));
}

gulp.task('build', build)
function build()
{
	bundle();
	compileSass();
	gulp.src('./bundle.js')
		.pipe(gulp.dest('./../build'));
	gulp.src('./bundle.css')
		.pipe(gulp.dest('./../build'));
	gulp.src('./**/*.html')
		.pipe(gulp.dest('./../build'));
	gulp.src('./content/**/*')
		.pipe(gulp.dest('./../build/content'));
		
		
}

