const gulp = require('gulp');

gulp.task('default', function(callback){

    console.log('hello');

    callback();
});


gulp.task('clone', function(){

    return gulp.src('app/*.*')
    .pipe(gulp.dest('public/'));
})