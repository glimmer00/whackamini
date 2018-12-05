// Declare gulp
const gulp = require('gulp');

// Declare all 3rd party tooling needed
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const del = require('del');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');

// Declare default values for babel to use
const babelOptions = {
  presets: [
    ['@babel/preset-env', {
      'targets': {
        'ie': '11',
        'browsers': [
          'last 2 versions'
        ]
      }
    }]
  ],
  comments: false,
  compact: true,
  minified: true
};

// Basic cleaning task used to remove all old dist files
gulp.task('clean', () => del('dist/'));


// Basic copy task used to move our single HTML file
gulp.task('copy', () => (
  gulp.src('src/index.html').pipe(gulp.dest('dist/'))
));

gulp.task('images', () => (
  gulp.src('src/images/**')
    .pipe(imageMin())
    .pipe(gulp.dest('dist/images'))
));

// Scripts task decleration to transpile JS and minify it
gulp.task('scripts', () => (
  gulp.src('src/js/**.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel(babelOptions))
    .pipe(concat('prod.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(concat('prod.min.js'))
    .pipe(gulp.dest('dist/js'))
));

// Sass task decleration to compile styles
gulp.task('sass', () => (
  gulp.src('src/scss/**.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      allowEmpty: false
    }))
    .pipe(autoprefixer({
      browsers: [
        'ie 11',
        'last 2 versions'
      ],
      cascade: false
    }))
    .pipe(concat('prod.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
));

// Creates generic browser sync serving task
gulp.task('serve', (done) => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'dist/'
    }
  });
  done();
});

// Creates induvidual browser sync RELOAD task
gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});

// Watch and recompile/reload when changes happen.
gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss').on('change', gulp.series('sass', 'reload'));
  gulp.watch('src/js/**/*.js').on('change', gulp.series('scripts', 'reload'));
  gulp.watch('src/**.html').on('change', gulp.series('copy', 'reload'));
  gulp.watch('src/images/**').on('change', gulp.series('images', 'reload'));
});

// The default task run this to serve your code locally
gulp.task('default', gulp.series(
  'clean', 'sass', 'scripts', 'images', 'copy', gulp.parallel('serve', 'watch')
));
