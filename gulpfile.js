const gulp   = require( 'gulp' );
const uglify = require( 'gulp-uglify' );
const pump   = require( 'pump' );
const babel  = require( 'gulp-babel' );
const rename  = require( 'gulp-rename' );

gulp.task('minify', function (cb) {
  pump([
    gulp.src('./folding-content.js'),
    babel({
      presets: ['es2015']
    }),
    uglify(),
    rename({ suffix: '.min' }),
    gulp.dest('.')
    ],
    cb
  );
});