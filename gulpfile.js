/**
 * Created by zlz on 16/12/1.
 */
var del=require('del');
var gulp=require('gulp');
var jshint = require('gulp-jshint');//js检验
var imagemin = require('gulp-imagemin');//图片压缩
var spriter = require('gulp-css-spriter');
var uglify=require('gulp-uglify');
var mincss=require('gulp-clean-css');//压缩css
var inline=require('gulp-inline-source'); //资源内联 （主要是js，css，图片）
var include=require('gulp-include'); //资源内联（主要是html片段）
var sequence=require('gulp-sequence');
var useref=require('gulp-useref'); //合并文件
var gulpif=require('gulp-if');
var print=require('gulp-print'); //打印命中的文件
var connect=require('gulp-connect'); //本地服务器

//清理构建目录
gulp.task('clean',function (cb) {
    del(['dist']).then(function () {
        cb()
    })
});

gulp.task('sprite', function() {
    return gulp.src('./css/index.css')
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': './dist/images/icons/spritesheet.png',
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': '../images/icons/spritesheet.png'
        }))
        .pipe(mincss())//压缩css
        .pipe(gulp.dest('./dist/css')); 

});


// js 代码校验
gulp.task('hintjs',function () {
    return gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
});
//压缩js
gulp.task('minjs',function () {
    return gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});
//压缩图片
gulp.task('minimage',function () {
    return gulp.src('./images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

gulp.task('html', function () {
    return gulp.src('./*.html')
        .pipe(inline())//把js内联到html中
        .pipe(include())//把html片段内联到html主文件中
        .pipe(useref())//根据标记的块  合并js或者css
        .pipe(gulpif('*.js',uglify()))
        .pipe(gulpif('*.css',mincss()))
        .pipe(connect.reload()) //重新构建后自动刷新页面
        .pipe(gulp.dest('dist'));
});
//本地服务器  支持自动刷新页面
gulp.task('connect', function() {
    connect.server({
        root: './dist', //本地服务器的根目录路径
        port:8080,
        livereload: true
    });
});
//sequence的返回函数只能运行一次 所以这里用function cb方式使用
gulp.task('watchlist',function (cb) {
    sequence('clean','sprite',['hintjs','minjs','minimage','html'])(cb)
});

gulp.task('watch',function () {
    gulp.watch(['./src/**'],['watchlist']);
});


//中括号外面的是串行执行， 中括号里面的任务是并行执行。
gulp.task('default',function (cb) {
    sequence('clean','sprite',['hintjs','minjs','minimage','html','connect'],'watch')(cb)
});