
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

var paths = {
    target: 'build-output',
    js: 'src/**/*.js',
    less: 'src/**/*.less',
    bowerJs: mainBowerFiles('**/*.js'),
    bowerLess: mainBowerFiles(['**/*.less', '**/*.css'])
};

var allJs = paths.bowerJs.concat(paths.js);
var allLess = paths.bowerLess.concat(paths.less);

gulp.task('clean', function(){
    return del.sync([paths.target + '/**'], {force: true})
});

gulp.task ('less', function(){
    var s = gulp.src(allLess);
    s = s.pipe(less());
    s = s.pipe(minify());
    s = s.pipe(concat('style.css'));
    s = s.pipe(gulp.dest(paths.target));
    return s;
})


gulp.task('move', function(){
    var s = gulp.src('./src/**/*.html');
    s = s.pipe(gulp.dest('build-output'));
    return s;
})

gulp.task ('js', function(){
    var s = gulp.src(allJs);
    s = s.pipe(sourceMaps.init());
    s = s.pipe(ngAnnotate());
    s = s.pipe(uglify());
    s = s.pipe(concat('app.js'));
    s = s.pipe(sourceMaps.write('/maps'));
    s = s.pipe(gulp.dest(paths.target));
    return s;
})

gulp.task('default', ['clean','move', 'less', 'js'], function(){
    browserSync.init([],{
        server:{
            baseDir: "./build-output"
        }
    })
});
