var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var debug = require('gulp-debug');
var cache = require('gulp-cached');
var remember = require('gulp-remember');

gulp.task('lint', function () {

    var s = gulp.src('src/**/*.js');
    s = s.pipe(cache('js'));
    s = s.pipe(debug());
    s = s.pipe(jshint());
    s = s.pipe(jshint.reporter('jshint-stylish'));
    s = s.pipe(remember('js'));

    return s
});


gulp.task('develop', function () {
    nodemon({
        script: './src/server.js',
        ext: 'js',
        env: {'NODE_ENV': 'development'},
        ignore: ['gulpfile.js']

    })
        .on('restart', function () {
            console.log('restarted!')
        })
});


// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['lint']);
});

// Default Task
gulp.task('default', ['lint', 'develop', 'watch']);
