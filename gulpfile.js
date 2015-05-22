var browserify = require('browserify');
var debowerify = require('debowerify');
var gulp = require('gulp');
var connect = require('gulp-connect');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var rigger = require('gulp-rigger');
var sourcemaps = require('gulp-sourcemaps');
var watchplugin = require('gulp-watch');
var opn = require('opn');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var tsify = require('tsify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var replace = require('gulp-replace-task');

var config = {
    isProduction: false,

    build: {
        html: 'build/',
        js: 'build/js/',
        jslib: 'build/js/lib/',
        jsfile: "app.js",
        css: 'build/css',
        img: 'build/img/',
        fonts: 'build/fonts'
    },
    
    src: {
        html: 'src/*.html',
        ts: './src/ts/JsDicomParser.ts',
        less: 'src/less/index.less',
        bootstrap_less: 'src/less/bootstrap.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        tests: '/src/tests/'
    },
    
    watch: {
        html: 'src/**/*.html',
        ts: 'src/ts/**/*.ts',
        less: 'src/less/**/*.less',        
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'   
    },
    
    clean: './build',

    server: {
        development: "https://uat-engine-testing.semantic.md",
        production: "https://uat-engine.semantic.md"
    },

    localServer: {
        host: 'localhost',
        port: '9000'
    }
};

gulp.task('html:build', function() {
    gulp.src(config.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(config.build.html))
        .pipe(connect.reload());
});

gulp.task('less:build', function() {
    gulp.src(config.src.less)
        .pipe(sourcemaps.init())
        .pipe(less({ sourceMap: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.build.css))
        .pipe(connect.reload());
});

gulp.task('bootstrap_less:build', function() {
    gulp.src(config.src.bootstrap_less)
        .pipe(sourcemaps.init())
        .pipe(less({ sourceMap: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.build.css))
        .pipe(connect.reload());
});

gulp.task('ts:build', function(    ) {
    var server = config.isProduction ? config.server.production : config.server.development;

    var bundler = browserify({debug: true, extensions: ['.ts']})
        .add(config.src.ts)
        .plugin(tsify, { noImplicitAny: true, sourceMap: true })
        .transform(debowerify)

    return bundler.bundle()
        .on('error', function (err) {
            console.log(err.message);
        })

        .pipe(source(config.build.jsfile))
        .pipe(buffer())
        .pipe(replace({
            patterns: [
                {
                  match: 'server',
                  replacement: server
                }
            ]
        }))        
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.build.js));
});



gulp.task('watch', function(){
    watchplugin([config.watch.html], function(){
        gulp.start('html:build');
    });

    watchplugin([config.watch.less], function(){
        gulp.start('less:build');
    });

    watchplugin([config.watch.ts], function(){
        gulp.start('ts:build');
    });    
});

gulp.task('build', [
    'html:build',
    'less:build',
    'ts:build'
]);

gulp.task('webserver', function(){
    connect.server({
        host: config.localServer.host,
        port: config.localServer.port,
        livereload: true,
    })    
});

gulp.task('openbrowser', function() {
    opn( 'http://' + config.localServer.host + ':' + config.localServer.port + '/build', 'chrome' );
});

gulp.task('clean', function(cb){
    rimraf(config.clean, cb);    
});

gulp.task('default', function() {
    return runSequence('build', 'watch', 'webserver', 'openbrowser');
});

gulp.task('rebuild', function(){
    return runSequence('clean', ['bootstrap_less:build', 'images:copy', 'build'], 'watch', 'webserver', 'openbrowser');    
});

gulp.task('jenkins', function(){
    return runSequence('clean', ['bootstrap_less:build', 'images:copy', 'build']);    
});
