'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var glob = require('glob');
var es = require('event-stream');
var uglify = require('gulp-uglify');

gulp.task('sass', function () {
    return gulp.src('./styles/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./styles/'));
});

gulp.task('watch', function () {
    gulp.watch(
        ['./styles/*/*.scss', './styles/*.scss', './js/*.jsx', './js/*/*.jsx'], ['sass', 'babel']);
});

gulp.task('uglify', ['babel'], function(done){

    glob('./js/**.jsx', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            var fileName = entry.substring(0, entry.length - 3) + 'js';
            return gulp.src(fileName)
                .pipe(uglify())
                .pipe(gulp.dest('./js/'));
        });
        es.merge(tasks).on('end', done);
    })
});

gulp.task('babel', function(done) {
    if (process.argv.indexOf('build') >= 0) { // switches on react production mode
        process.env.NODE_ENV = "production";
    }
    glob('./js/**.jsx', function(err, files) {
        if(err) done(err);
        var tasks = files.map(function(entry) {
            var fileName = entry.substring(0, entry.length - 3) + 'js';
            return browserify({ entries: [entry], extensions: ['.jsx'] })
                .transform("babelify", {presets: ["es2015", "react"],
                    plugins: ["transform-object-rest-spread", "transform-class-properties", "es6-promise"]})
                .bundle()
                .pipe(source(fileName))
                .pipe(gulp.dest('.'));
        });
        es.merge(tasks).on('end', done);
    })
});


gulp.task('default', ['watch']);

gulp.task('build', ['sass', 'uglify'] );