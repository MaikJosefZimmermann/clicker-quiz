var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate')
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var mainBowerFiles = require('main-bower-files');
var sourceMaps = require('gulp-sourcemaps');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var debug = require('gulp-debug');
var util = require('gulp-util')
var paths = {
    target: 'build-output',
    js: 'src/**/*.js',
    less: 'src/**/*.less',
    bowerJs: mainBowerFiles('**/*.js'),
    bowerLess: mainBowerFiles(['**/*.less', '**/*.css'])
};

var onError = function (err) {
    util.log(util.colors.red.bold('[ERROR]:'), util.colors.bgRed(err.message));
    this.emit('end');
};

var allJs = paths.bowerJs.concat(paths.js);
var allLess = paths.bowerLess.concat(paths.less);

gulp.task('clean', function () {
    return del.sync([paths.target + '/**'], {force: true})
});

gulp.task('less', function () {
    var s = gulp.src(allLess);
    s = s.pipe(cache('less'));
    s = s.pipe(less());
    s = s.on('error', onError);
    s = s.pipe(minify());
    s = s.pipe(debug());
    s = s.pipe(remember('less'));
    s = s.pipe(concat('style.css'));
    s = s.pipe(gulp.dest(paths.target));
    s = s.pipe(browserSync.stream());
    return s;
});


gulp.task('moveHtml', function () {
    var s = gulp.src('./src/**/*.html');
    s = s.pipe(gulp.dest('build-output'));
    s = s.pipe(browserSync.stream());
    return s;
});

gulp.task('js', function () {
    var s = gulp.src(allJs);
    s = s.pipe(sourceMaps.init());
    s = s.pipe(cache('js'));
    s = s.pipe(ngAnnotate());
    s = s.pipe(uglify());
    s = s.pipe(debug());
    s = s.pipe(remember('js'));
    s = s.pipe(concat('app.js'));
    s = s.pipe(sourceMaps.write('/maps'));
    s = s.pipe(gulp.dest(paths.target));
    s = s.pipe(browserSync.stream());
    return s;
});

// strg + shift + numpad / = auskommentieren

gulp.task('moveAssets', function () {
    var s = gulp.src('./assets/**');
    s = s.pipe(gulp.dest(paths.target + '/assets'));
    return s;
});

gulp.task('watch', function () {

    gulp.watch('src/**/*.less', ['less']);
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/**/*.html', ['moveHtml']);

});

gulp.task('default', ['clean', 'moveAssets', 'moveHtml', 'watch', 'less', 'js'], function () {
    browserSync.init([], {
        server: {
            baseDir: "./build-output"
        }
    })
});

// strg+shift+a reformat zum formatieren
