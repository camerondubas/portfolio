// ##############################################
// ############# Require Plugins ################
// ##############################################

var gulp        = require('gulp'),
  autoprefixer  = require('gulp-autoprefixer'),
  cache         = require('gulp-cache'),
  clean         = require('gulp-clean'),
  concat        = require('gulp-concat'),
  connect       = require('gulp-connect'),
  imagemin      = require('gulp-imagemin'),
  jshint        = require('gulp-jshint'),
  less          = require('gulp-less'),
  minifyCSS     = require('gulp-minify-css'),
  minifyHTML    = require('gulp-minify-html'),
  rename        = require('gulp-rename'),
  server        = require('gulp-express'),
  uglify        = require('gulp-uglify'),
  watch         = require('gulp-watch')

// ##############################################
// ############# Default Task ###################
// ##############################################
gulp.task('default', ['clean', 'server'], function () {
  gulp.start('styles', 'scripts', 'images')
});

// ##############################################
// ############# Connect Task ###################
// ##############################################
gulp.task('server', function () {
  server.run({
    file: 'server/app.js'
  })
});

// ##############################################
// ############# Styles Task ####################
// ##############################################
gulp.task('styles', function () {
  return gulp.src(['src/**/*.less', '!src/**/_*.less'])
    .pipe(less())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({dirname: 'css'}))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});


// ##############################################
// ############# Scripts Task ###################
// ##############################################
gulp.task('scripts', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint('.jshintrc.js'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({dirname: 'js'}))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});


// ##############################################
// ############# Images Task ####################
// ##############################################
gulp.task('images', function () {
  return gulp.src('src/images/**/*.*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(rename({dirname: 'images'}))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

// ##############################################
// ################ Clean Task ##################
// ##############################################
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});


// ##############################################
// ############# Watch Task #####################
// ##############################################
gulp.task('watch', function () {
  gulp.watch('src/**/*.html', [ 'components']);
    gulp.watch('src/**/*.less', ['styles']);
    gulp.watch(['src/**/*.js', 'server/app.js'], ['scripts']);
    gulp.watch('src/**/*.*', ['images']);
    gulp.watch('src/images/**/*.*', ['images']);
});
