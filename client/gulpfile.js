'use strict';
var gulp = require('gulp-param')(require('gulp'), process.argv);
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var util = require('gulp-util');
var sourceMaps = require('gulp-sourcemaps');
var del = require('del');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence').use(gulp);
var gulpif = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var cachebust = require('gulp-cache-bust');
var critical = require('critical').stream;
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var exit = require('gulp-exit');
var jshint = require('gulp-jshint');
var lessVariables = require('./variables.json');
var developmentMode = false;

var proxyMiddleware = require('http-proxy-middleware');
var proxyUrl = 'http://localhost:9000';


var onError = function (err) {
    util.log(
        util.colors.red.bold('[ERROR:' + err.plugin + ']:'),
        util.colors.bgRed(err.message),
        util.colors.red.bold('in:' + err.fileName)
    );
    this.emit('end');
};


var paths = {

    target: 'build-output',

    bowerJs: mainBowerFiles('**/*.js'),
    bowerLess: mainBowerFiles(['**/*.less', '**/*.css']),

    customLess: ['src/**/*.less'],
    customJs: ['src/**/*.js']
};


function compileLess(opt) {
    var s = gulp.src(opt.src);
    s = s.pipe(gulpif(opt.sourceMap, sourceMaps.init()));
    s = s.pipe(cache(opt.fileName));
    s = s.pipe(debug());
    s = s.pipe(less({
        modifyVars: lessVariables
    }));
    s = s.on('error', onError);
    s = s.pipe(gulpif(!developmentMode, minifyCss()));
    s = s.pipe(remember(opt.fileName));
    s = s.pipe(concat(opt.fileName));
    s = s.pipe(gulpif(opt.sourceMap, sourceMaps.write(developmentMode ? "" : "/maps")));
    s = s.pipe(gulpif(opt.liveServer, browserSync.stream()));
    return s.pipe(gulp.dest(paths.target));
}


function compileJs(opt) {
    var s = gulp.src(opt.src);
    s = s.pipe(gulpif(opt.sourceMap, sourceMaps.init()));
    s = s.pipe(cache(opt.fileName));
    s = s.pipe(debug());
    s = s.pipe(gulpif(!opt.dontLint, jshint()));
    s = s.pipe(gulpif(!opt.dontLint, jshint.reporter('jshint-stylish')));
    s = s.pipe(gulpif(!developmentMode, ngAnnotate()));
    s = s.pipe(gulpif(!developmentMode, uglify()));
    s = s.on('error', onError);
    s = s.pipe(remember(opt.fileName));
    s = s.pipe(concat(opt.fileName));
    s = s.pipe(gulpif(opt.sourceMap, sourceMaps.write("/maps")));
    s = s.pipe(gulpif(opt.liveServer, browserSync.stream()));
    return s.pipe(gulp.dest(paths.target));
}

function compileHtml() {
    var s = gulp.src('./**/*.html', {cwd: './src'});
    s = s.pipe(cachebust({
        type: 'timestamp'
    }));
    s = s.pipe(cache("html"));
    s = s.pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
    }));
    s = s.on('error', onError);
    s = s.pipe(cache("remember"));
    s = s.pipe(browserSync.stream());
    s = s.pipe(gulp.dest(paths.target));
    return s;
}

gulp.task('html', function () {
    util.log('processing html...');
    return compileHtml();
});


gulp.task('moveAssets', function () {
    //assets
    // when deploying don't copy images (see imgMin task below)!
    var src = developmentMode ? "./assets/**" : ['./assets/**', '!./assets/**/*.svg', '!./assets/**/*.gif', '!./assets/**/*.jpg', '!./assets/**/*.png'];
    return gulp.src(src)
        .pipe(gulp.dest(paths.target + '/assets'))
        .pipe(browserSync.stream());
});


gulp.task('imgMin', function () {
    var s = gulp.src(['./assets/**/*.svg', './assets/**/*.gif', './assets/**/*.jpg', './assets/**/*.png'])
    s = s.pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }));
    s = s.pipe(debug());
    s = s.pipe(gulp.dest('build-output/assets/'));
    return s
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.less', ['less']);
    gulp.watch('src/**/*.js', ['js:custom']);


    gulp.watch(['src/**/*.html'], ['html']);
    gulp.watch(['assets/**/*'], ['moveAssets']);

});


gulp.task('less', function () {
    util.log('Compiling less..');
    var opt = {
        src: paths.bowerLess.concat(paths.customLess),
        fileName: "style.css",
        sourceMap: true,
        sourceMapTaget: "",
        liveServer: true
    };
    return compileLess(opt);
});


gulp.task('js:vendor', function () {
    util.log('Compile JS..');
    var opt = {
        src: paths.bowerJs,
        fileName: "vendor.js",
        sourceMap: true,
        sourceMapTaget: "/maps",
        liveServer: true,
        dontLint: true
    };
    return compileJs(opt);
});

gulp.task('js:custom', function () {
    util.log('Compile Custom JS..');
    var opt = {
        src: paths.customJs,
        fileName: "app.js",
        sourceMap: true,
        sourceMapTaget: "/maps",
        liveServer: true
    };
    return compileJs(opt);
});


gulp.task('clean', function () {
    util.log('Delete old files ...');
    return del.sync([paths.target + '**/*'], {force: true});
});

gulp.task('set:dev', function () {
    developmentMode = true;
    util.log('now running in development mode');
});

gulp.task('copy', function () {
    util.log('copy files');
    var s = gulp.src('./**/*', {cwd: './copy', dot: true});
    s = s.pipe(gulp.dest(paths.target));
    return s
});


gulp.task('critical', function () {

    var s = gulp.src('build-output/index.html');
    s = s.pipe(debug());
    s = s.pipe(critical({
        base: 'build-output/',
        inline: true,
        css: ['build-output/style.css']
    }));
    s = s.pipe(gulp.dest('build-output/'));
    s = s.pipe(exit());
    return s
});

gulp.task('browserSync', function () {
    browserSync.init([], {
        open: false,
        injectChanges: true,
        online: true,
        reloadOnRestart: true,
        port: 3000,
        server: {
            baseDir: 'build-output',
            directory: false,
            middleware: proxyMiddleware('/api', {target: proxyUrl})


        }
    })
});


/*--------------------
 *  Run Tasks:
 *---------------------*/

var mainChain = ['less', 'html', 'js:custom', 'js:vendor', 'moveAssets', 'copy', 'watch'];
var deployChain = ['imgMin'];

gulp.task('default', function () {
    runSequence('set:dev',
        'clean',
        mainChain,
        'browserSync'
    );
});

gulp.task('deploy', function () {
    runSequence('clean',
        mainChain,
        deployChain
    );
});
