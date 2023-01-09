const gulp = require('gulp');
const del = require("del"); // очистка папки dist
const browsersync = require("browser-sync").create();
const scss = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const minccss = require("gulp-clean-css"); // минификация css
const sourcemaps = require("gulp-sourcemaps"); // карта css для 
const autoprefixer = require("gulp-autoprefixer"); // префиксы для разных браузеров
const babel = require("gulp-babel"); // поддержка старого стиля js
const concat = require("gulp-concat"); // объединение js-файлов
const uglify = require("gulp-uglify"); // минификация js
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const newer = require('gulp-newer'); // отслеживает только новые файлы
// const urlAdjuster = require("gulp-css-url-adjuster");

// Пути к изначальным и конечным файлам
const paths = {
  html: {
    src: "src/*.html",
    dest: "dist/",
  },
  styles: {
    src: "src/css/**/*.scss",
    dest: "dist/css",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js",
  },
  images: {
    src: "src/img/*",
    dest: "dist/img",
  },
};

// Очистка каталога dist перед сохранением в него файлов
function clean() {
   return del(['dist/*', '!dist/img'])
}

// Обработка и сжатие изображений
function img() {
   return gulp
     .src(paths.images.src)
     .pipe(newer(paths.images.dest))
     .pipe(
       imagemin([
         imagemin.gifsicle({ interlaced: true }),
         imagemin.mozjpeg({ quality: 75, progressive: true }),
         imagemin.optipng({ optimizationLevel: 5 }),
         imagemin.svgo({
           plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
         }),
       ])
     )
     .pipe(gulp.dest(paths.images.dest));
}

// Обработка и минификация html
function html() {
   return gulp
     .src(paths.html.src)
     .pipe(htmlmin({ collapseWhitespace: true }))
     .pipe(gulp.dest(paths.html.dest))
     .pipe(browsersync.stream());
}

// Обработка стилей
function styles() {
   return gulp
     .src(paths.styles.src)
     .pipe(sourcemaps.init())
     .pipe(scss())
     .pipe(
       autoprefixer({
         cascade: false,
         grid: true,
         overrideBrowserslist: ["last 5 versions"],
       })
     )
     .pipe(
       minccss({
         level: 2,
       })
     )
     .pipe(
       rename({
         basename: "style",
         suffix: ".min",
       })
     )
     .pipe(sourcemaps.write("."))
     .pipe(gulp.dest(paths.styles.dest))
     .pipe(browsersync.stream());
}

// Обработка скриптов
function scripts() {
   return gulp
     .src(paths.scripts.src)
     .pipe(sourcemaps.init())
     .pipe(
       babel({
         presets: ["@babel/env"],
       })
     )
     .pipe(uglify())
     .pipe(concat("main.min.js"))
     .pipe(sourcemaps.write("."))
     .pipe(gulp.dest(paths.scripts.dest))
     .pipe(browsersync.stream());
}

// Отслеживание изменений в реальном времени
function watch() {
   browsersync.init({
     server: {
       baseDir: "./dist/",
     },
   });
   gulp.watch(paths.html.dest).on("change", browsersync.reload);
   gulp.watch(paths.html.src, html);
   gulp.watch(paths.styles.src, styles);
   gulp.watch(paths.scripts.src, scripts);
   gulp.watch(paths.images.src, img);
}

// series - задачи выполняются последовательно, parallel - параллельно
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch);

// Экспорт всех ф-ций
exports.clean = clean;
exports.html = html;
exports.img = img;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build; // задача 'gulp build'
exports.default = build; // default - это просто 'gulp'

