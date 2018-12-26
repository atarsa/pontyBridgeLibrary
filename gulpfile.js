var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    nunjucksRender = require('gulp-nunjucks-render'),
    del = require('del')
    autoprefixer = require('gulp-autoprefixer');


// define the default task and watch task to it
gulp.task('default', ['watch']);



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
  return del('app/js/all.js');
});

gulp.task('scripts', ['clean-js'], function(){
  return gulp.src(['app/source/js/uiVars.js', 'app/source/js/main.js', 'app/source/js/**/*.js']) // add proper order of files
    .pipe(concat('all.js'))
    .pipe(gulp.dest('app/js'));
});

gulp.task('sass', function(){
  return gulp.src('app/source/scss/**/*.scss') // gets all scss files
    .pipe(sass()) // Using gulp-sass
    .pipe(autoprefixer()) // add prefixes to css
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



// Watch more than one task:
gulp.task('watch', ['browserSync', 'sass', 'nunjucks', 'scripts'], function(){
  gulp.watch('app/source/scss/**/*.scss', ['sass']);
  gulp.watch('app/source/**/*.njk', ['nunjucks']);
  gulp.watch('app/source/js/**/*.js', ['scripts']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch()
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/source/js/**/*.js', browserSync.reload);
});

