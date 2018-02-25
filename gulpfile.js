const gulp = require('gulp');
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const webserver = require('gulp-webserver');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

// STYLES

gulp.task('styles', function() {
  return gulp
    .src('src/styles/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('styles:build', function() {
  return gulp
    .src('src/styles/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

// MEDIA

gulp.task('media', function() {
  return gulp.src('src/media/**/*').pipe(gulp.dest('tmp/media'));
});

gulp.task('media:build', function() {
  return gulp.src('src/media/**/*').pipe(gulp.dest('dist/media'));
});

// SCRIPTS

gulp.task('scripts', function() {
  return browserify({
    entries: 'src/scripts/scripts.js',
    debug: true
  })
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(gulp.dest('tmp/js'));
});

gulp.task('scripts:build', function() {
  return browserify({
    entries: 'src/scripts/scripts.js',
    debug: true
  })
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(gulp.dest('dist/js'));
});

// HTML

gulp.task('pages', function() {
  return gulp.src('src/*.html').pipe(gulp.dest('tmp'));
});

gulp.task('pages:build', function() {
  return gulp.src('src/*.html').pipe(gulp.dest('dist'));
});

// INJECTION TASKS

gulp.task('inject', ['media', 'styles', 'scripts', 'pages'], function() {
  return gulp
    .src('tmp/*.html')
    .pipe(inject(gulp.src('tmp/css/styles.css'), { relative: true }))
    .pipe(inject(gulp.src('tmp/js/*.js'), { relative: true }))
    .pipe(gulp.dest('tmp'));
});

gulp.task(
  'inject:build',
  ['media:build', 'styles:build', 'scripts:build', 'pages:build'],
  function() {
    return gulp
      .src('dist/*.html')
      .pipe(inject(gulp.src('dist/css/styles.css'), { relative: true }))
      .pipe(inject(gulp.src('dist/js/*.js'), { relative: true }))
      .pipe(gulp.dest('dist'));
  }
);

// SERVE AND BUILD TASKS

gulp.task('default', ['inject'], function() {
  gulp.watch('src/**/*', ['inject']);
  return gulp.src('tmp').pipe(
    webserver({
      port: 3000,
      livereload: true,
      open: true
    })
  );
});

gulp.task('build', ['inject:build']);