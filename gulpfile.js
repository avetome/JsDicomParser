var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var watchplugin = require('gulp-watch');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var tsc = require('gulp-typescript');
var tslint = require('gulp-tslint');
var del = require('del');
var concat = require('gulp-concat');
var config = require('./gulpfile.config');

gulp.task('ts:build', function () {
    var tsResult = gulp.src(config.src.ts)
                       .pipe(sourcemaps.init())
                       .pipe(tsc({
                           target: 'ES5',
                           declarationFiles: false,
                           noExternalResolve: true
                       }));

        return tsResult.js.pipe(concat(config.build.jsfile))
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest(config.build.js));
});

gulp.task('watch', function(){
    watchplugin([config.watch.ts], function(){
        gulp.start('ts:build');
    });    
});

gulp.task('build', [
    'ts:build'
]);

gulp.task('clean', function(cb){
    rimraf(config.clean, cb);    
});

gulp.task('default', function() {
    return runSequence('build', 'watch');
});