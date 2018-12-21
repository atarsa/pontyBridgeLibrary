var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    nunjucksRender = require('gulp-nunjucks-render'),
    del = require('del');


// define the default task and watch task to it
gulp.task('default', ['watch']);


// configure the jshint task
gulp.task('jshint', function(){
  return gulp.src('./app/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


// configure nunjucks templating task
gulp.task('nunjucks', function(){
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/source/pages/**/*.+(html|nunjucks|njk)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/source/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('app'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// clean all.js before re-build
gulp.task('clean-js', function(){
  return del('app/source/js/all.js');
});

gulp.task('scripts', ['clean-js'], function(){
  return gulp.src(['app/source/js/uiVars.js', 'app/source/js/main.js', 'app/source/js/**/*.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('app/source/js'));
});

gulp.task('sass', function(){
  return gulp.src('app/source/scss/**/*.scss') // gets all scss files
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

// Gulp watch syntax
// gulp.watch('app/scss/**/*.scss', ['sass']);

// To watch more than one task:
gulp.task('watch', ['browserSync', 'sass', 'nunjucks', 'scripts'], function(){
  //gulp.watch('source/javascript/**/*.js', ['jshint']);
  gulp.watch('app/source/scss/**/*.scss', ['sass']);
  gulp.watch('app/source/**/*.njk', ['nunjucks']);
  gulp.watch('app/source/js/**/*.js', ['scripts']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch()
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/source/js/**/*.js', browserSync.reload);
});