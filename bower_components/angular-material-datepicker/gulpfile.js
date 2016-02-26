require('es6-promise').polyfill();
var gulp = require('gulp');
var sass = require('gulp-sass');
var nano = require('gulp-cssnano');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var htmlmin	= require('gulp-htmlmin');
var ngtemplate = require('gulp-ngtemplate');
var order = require('gulp-order');

gulp.task('browserSync', function() {
	browserSync({
		server: {
					baseDir: "example/",
					routes: {
        		"/bower_components": "bower_components",
						"/dist" : "dist"
    			}
				}
		})
});

gulp.task('tpl', function() {
	return gulp.src('src/*.tpl')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(ngtemplate({module: 'amDate'}))
		.pipe(rename('angular-material-datepicker.tpl.js'))
		.pipe(gulp.dest('temp/'))
});

gulp.task('js', ['tpl'], function() {
  return gulp.src(['src/angular-material-datepicker.js', 'temp/angular-material-datepicker.tpl.js'])
		.pipe(order(['src/angular-material-datepicker.js', 'temp/angular-material-datepicker.tpl.js']))
		.pipe(plumber())
    	.pipe(concat('angular-material-datepicker.js'))
	  	.pipe(gulp.dest('dist/'))
	  	.pipe(uglify())
	  	.pipe(rename({suffix: '.min'}))
    	.pipe(gulp.dest('dist/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('sass', function() {
	return gulp.src('src/*.sass')
		.pipe(plumber())
		.pipe(sass())
		.pipe(concat('angular-material-datepicker.css'))
		.pipe(gulp.dest('dist/'))
        .pipe(nano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('html', function() {
	browserSync.reload({stream: true})
});


gulp.task('watch', ['browserSync', 'js', 'sass', 'html'], function() {
	gulp.watch('src/*.js', ['js']);
	gulp.watch('src/*.tpl', ['js'])
	gulp.watch('src/*.sass', ['sass']);
	gulp.watch('example/*.html', ['html']);
});

gulp.task('default', ['js', 'sass', 'watch']);
