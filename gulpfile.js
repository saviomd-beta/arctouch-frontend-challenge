var autoprefixer = require('autoprefixer');
var autoprefixerConfig = require('tools-config-saviomd/autoprefixer-config');
var babel = require('gulp-babel');
var babelConfig = require('tools-config-saviomd/babel-config');
var browserSync = require('browser-sync');
var browserSyncConfig = require('tools-config-saviomd/browser-sync-config');
var concat = require('gulp-concat');
var cssnano = require('cssnano');
var cssnanoConfig = require('tools-config-saviomd/cssnano-config');
var del = require('del');
var eslint = require('gulp-eslint');
var eslintConfig = './node_modules/tools-config-saviomd/eslint-config.js';
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var htmlminConfig = require('tools-config-saviomd/htmlmin-config');
var jade = require('gulp-jade');
var jadeConfig = require('tools-config-saviomd/jade-config');
var postcss = require('gulp-postcss');
var postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var scss = require('postcss-scss');
var sourcemaps = require('gulp-sourcemaps');
var stylelint = require('stylelint');
var stylelintConfig = require('tools-config-saviomd/stylelint-config');
var uglify = require('gulp-uglify');

browserSyncConfig.server.baseDir = 'build';

/*
tasks
====================
*/
gulp.task('clean', function(cb) {
	return del('build', cb)
});

gulp.task('html', function() {
	return gulp.src('_src/pages/*.jade')
		.pipe(jade(jadeConfig))
		.pipe(htmlmin(htmlminConfig))
		.pipe(gulp.dest('build'))
});

gulp.task('cssLint', function() {
	return gulp.src('_src/css/_*.scss')
		.pipe(postcss([ stylelint(stylelintConfig) ], { syntax: scss }))
});

gulp.task('css', ['cssLint'], function() {
	return gulp.src('_src/css/challenge.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([ autoprefixer(autoprefixerConfig), postcssFlexbugsFixes() ]))
		.pipe(gulp.dest('build/css'))
		.pipe(postcss([ cssnano(cssnanoConfig) ]))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/css'))
});

gulp.task('jsLint', function() {
	return gulp.src('_src/js/_*.js')
		.pipe(eslint(eslintConfig))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
});

gulp.task('js', ['jsLint'], function() {
	return gulp.src(require('./_src/js/challenge.js'))
		.pipe(sourcemaps.init())
		.pipe(babel(babelConfig))
		.pipe(concat('challenge.js'))
		.pipe(gulp.dest('build/js'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js'))
});

gulp.task('browserSync', function() {
	browserSync.init(browserSyncConfig);
});

/*
build and dev tasks
====================
*/
gulp.task('default', ['clean'], function() {
	gulp.start('html', 'css', 'js');
});

gulp.task('dev', ['browserSync'], function() {
	gulp.watch('_src/**/*.jade', ['html', browserSync.reload])
	gulp.watch('_src/css/*.scss', ['css', browserSync.reload])
	gulp.watch('_src/js/*.js', ['js', browserSync.reload])
});
