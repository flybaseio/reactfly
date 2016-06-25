'use strict';

/**************/
/*  REQUIRES  */
/**************/
var gulp = require('gulp');
var runSequence = require('run-sequence');

// File IO
var exit = require('gulp-exit');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var extReplace = require('gulp-ext-replace');

// Testing
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');


/****************/
/*  FILE PATHS  */
/****************/
var paths = {
  destDir: 'dist',

  srcFiles: [
    'src/reactfly.js'
  ]
};


/***********/
/*  TASKS  */
/***********/
/* Builds the distribution files */
gulp.task('build', function() {
  return gulp.src(paths.srcFiles)
    // Write un-minified version
    .pipe(gulp.dest(paths.destDir))

    // Minify
    .pipe(uglify({
      preserveComments: 'some'
    }))

    // Change the file extension
    .pipe(extReplace('.min.js'))

    // Write minified version
    .pipe(gulp.dest(paths.destDir));
});

// Re-lints and re-builds every time a source file changes
gulp.task('watch', function() {
	gulp.watch([paths.srcFiles], ['build']);
});

// Default task
gulp.task('default', function(done) {
  runSequence('build', function(error) {
    done(error && error.err);
  });
});
