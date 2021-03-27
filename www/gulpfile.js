const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const miniJS = require('gulp-uglify');
const babel = require('gulp-babel');
const autopre = require('gulp-autoprefixer');
const del = require('del');

gulp.task('miniJS', function () {
    return gulp.src('app/js/*.js')
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(miniJS())
        .pipe(gulp.dest('public/js/'));
});

gulp.task('delCSS', function () {
    return del('public/css/*.css');
});

gulp.task('delJS', function () {
    return del('public/js/*.js');
});

gulp.task('miniCSS', function () {
    return gulp.src('app/css/*.css')
        .pipe(autopre({
            overrideBrowserslist: ['last 10 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/css/'));
});

gulp.task('watch', function () {
    gulp.watch('app/js/*.js', gulp.series('miniJS'));
    gulp.watch('app/css/*.css', gulp.series('miniCSS'));
});

gulp.task('build', gulp.series('delCSS', 'miniCSS', 'delJS', 'miniJS'));
gulp.task('default', gulp.parallel('watch', 'build'));