const gulp         = require('gulp');
const less 		   = require('gulp-less');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
const rename       = require('gulp-rename');
const cleanCSS     = require('gulp-clean-css');
const del          = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cache        = require('gulp-cache');
const imagemin     = require('gulp-imagemin');
const imagPngquant = require('imagemin-pngquant');
const smartgrid    = require('smart-grid');



/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'less', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1200px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px',
            fields: '15px' /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '560px'
        }
        /* 
        We can create any quantity of break points.
 
        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
    }
};
 
smartgrid('app/less', settings);

const jsFile =['app/lib/jquery-3.3.1.min.js', 
// 'app/lib/typeit.min.js', 
'app/lib/scrollreveal.js',
'app/js/script.js'
];

gulp.task('less', function() {
	return gulp.src('app/less/**/*.less') // Берем источник
	       .pipe(less ())// Преобразуем less в CSS посредством gulp-less
	       .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
            .pipe(cleanCSS({
                level: 2
           }))
           .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
	       .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
	       .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
});


gulp.task('scripts', function() {
    return gulp.src(jsFile)
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify({
            toplevel: true
        })) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')) // Выгружаем в папку app/js
        .pipe(browserSync.stream()); //перезагружаем страницу
});


gulp.task('code', function() {
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({ stream: true }))
});



gulp.task('watch', function(){
    gulp.watch('app/less/**/*.less', gulp.parallel('less'));
    gulp.watch(['app/js/script.js', 'app/lib/**/*.js'], gulp.parallel('scripts'));
    gulp.watch('app/*.html', gulp.parallel('code'));
});

//-------------------продакшен-------------------//

gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [imagPngquant()]
		}))/**/)
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('prebuild', async function() {

	var buildCss = gulp.src( // Переносим библиотеки в продакшен
		'app/css/*.min.css'
		)
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));


});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default',gulp.parallel('less','scripts','browser-sync','watch'));
gulp.task('build', gulp.parallel('prebuild', 'clear', 'img', 'less', 'scripts'));