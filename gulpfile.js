var gulp       = require('gulp'),
    browserify = require('gulp-browserify');

gulp.task('browserify', function() {
  return gulp.src('./lib/client.js')
    .pipe(browserify({
      insertGlobals: true,
      fullPaths: true, 
      transform: ['reactify']
    }))
    .pipe(gulp.dest('./build'))
});



gulp.task('default', ['browserify']);