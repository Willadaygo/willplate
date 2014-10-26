'use strict';

//	VARIABLES
// --------------------

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	sass = require('gulp-ruby-sass'),
	rimraf = require('rimraf'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	source = require('vinyl-source-stream')

var dev = 'src/',
	prod = 'public/',
	paths = {
		pages: dev + 'templates/**/*.twig',
		img: dev + 'img/**/*',
		css: dev +'css/*.styl',
		js: dev + 'js/*.js',
		vendors: dev + 'js/vendor/*.js',
		fonts: dev + 'fonts/**/*'
	};



//	TEMPLATES
// --------------------

gulp.task('templates', function () {
	return gulp.src(paths.pages)
		.pipe($.twig())
		.on("error", $.notify.onError(function (error) {
			return "Template Error: " + error.message;
		}))
		.pipe($.rename(function (path) {
			path.extname = '.html';
		}))
		.pipe(gulp.dest(prod));
});



//	FONTS
// --------------------

gulp.task('fonts', function () {
	return gulp.src(paths.fonts)
		.pipe($.changed(prod + 'fonts'))
		.pipe(gulp.dest(prod + 'fonts'));
});

//	IMAGES
// --------------------

gulp.task('images', function () {
	return gulp.src(paths.img)
		.pipe($.changed(prod + 'img'))
		.pipe($.imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(prod + 'img'));
});

//	CSS
// --------------------

gulp.task('styles', function () {
	return gulp.src(dev + "css/styles.scss")
		.pipe(sass({ style: 'expanded' }))
		.on("error", $.notify.onError(function (error) {
			return "Sass Error: " + error.message;
		}))
		.pipe($.autoprefixer())
		// .pipe($.minifyCss())
		.pipe(gulp.dest(prod + 'css'));
});



//	CLEAN
// --------------------

gulp.task('clean', function () {
    rimraf(prod, function(er) {
		if (er) throw er
	});
});


//	JS
// --------------------

gulp.task('jshint', function () {
    return gulp.src(paths.js)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('scripts', function(){
	return gulp.src(paths.js)
		// .pipe($.uglify())
		.pipe(gulp.dest(prod + 'js'));
});


gulp.task('vendorScripts', function(){
	return gulp.src(paths.vendors)
		.pipe($.concat('vendors.js'))
		// .pipe($.uglify())
		.pipe(gulp.dest(prod + 'js'));
});


//	SERVER
// --------------------

gulp.task('server', function(){
	return browserSync.init([prod + '**/*'], {
		// open: true,
		server: {
            baseDir: prod
        },
		notify: false
	});
});


//	WATCH
// --------------------

gulp.task('watch', function(){
	gulp.watch(dev +'css/**', ['styles']);
	gulp.watch([paths.js], ['scripts', 'jshint']);
	gulp.watch(paths.vendors, ['vendorScripts']);
	gulp.watch(paths.img, ['images']);
	gulp.watch([paths.pages, dev + 'templates/partials/**'], ['templates']);
});

gulp.task('default', ['fonts', 'templates', 'styles', 'vendorScripts', 'scripts', 'server', 'watch']);
