var gulp = require('gulp');

// Requires the gulp-sass plugin
var sass = require('gulp-sass');
// requires the browser-sync
var browserSync = require('browser-sync').create();
var nunjucksRender = require('gulp-nunjucks-render');

gulp.task('nunjucks', function(){
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks|njk)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('app'))
  .pipe(browserSync.reload({
    stream: true
  }));
})


gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss') // gets all scss files
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
gulp.task('watch', ['browserSync', 'sass', 'nunjucks'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.nunjucks', ['nunjucks']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch()
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});