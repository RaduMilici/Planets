//deps
var gulp = require('gulp');
var pump = require('pump');
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var webserver = require('gulp-webserver');

//paths;
var js_path = './js';
var css_path = './css'
var build_path = './build';
var build_name = 'build.js';
var index_path = './index.html';
var min_build_name = 'build.min.js';
var components_path = path.join(js_path, 'components');

//wiredep task
gulp.task('wiredep', function () {
  gulp.src('./index.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(gulp.dest("."));
});

//concat task
gulp.task('concat', ['wiredep'], function(){
    return gulp.src([
        path.join(js_path, '**', 'app.js'),
        path.join(js_path, '**', '*.js')
    ])
    .pipe(concat(build_name))
    .pipe(gulp.dest(build_path));
});

//compress task
gulp.task('compress', ['concat'], function(cb){
    pump([
        gulp.src(path.join(build_path, build_name)),
        rename(min_build_name),
        uglify(),
        gulp.dest(build_path)
    ], cb);
});

//inject task
gulp.task('inject', ['compress'], function(){
    var target = gulp.src(index_path);
    var sources = gulp.src([
        path.join(js_path, 'app.js'),
        path.join(js_path, '**', '*.js'),
        path.join(css_path, '*.css')
    ], {read: false});

    return target.pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

//webserver task
gulp.task('webserver', ['inject'], function(){
  gulp.src('.')
    .pipe(webserver({
      livereload: true,  
      open: true
    }));
});

//watch task
/*
gulp.task('watch', function(){
    gulp.watch(path.join(js_path, '**'), ['inject']);
});
*/

//default task
gulp.task('default', ['webserver']);