// gulpfile.mjs

import gulp from 'gulp';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import sassCompiler from 'sass';
import svgSprite from 'gulp-svg-sprite';
import cheerio from 'gulp-cheerio';
import newer from 'gulp-newer';

// Настройка Gulp-Sass с использованием компилятора Sass
const gulpSass = sass(sassCompiler);

const bs = browserSync.create();

const paths = {
  images: {
      src: 'src/images/**/*',  // Исходные изображения
      dest: 'dist/images'      // Папка назначения
  }
};

// Задача для компиляции Pug в HTML
export const pugTask = () => {
  return gulp.src('src/pages/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
};

// Задача для компиляции Sass в CSS
export const sassTask = () => {
  return gulp.src(['src/sass/**/*.scss', 'src/components/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream());
};

// Задача для обработки JavaScript
export const jsTask = () => {
  return gulp.src(['src/js/**/*.js', 'src/components/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(bs.stream());
};

// Задача для копирования изображений
function imagesTask() {
  return gulp.src(paths.images.src)
      .pipe(newer(paths.images.dest))  // Копировать только измененные файлы
      .pipe(gulp.dest(paths.images.dest));  // Копирование в папку назначения
}

// Задача для копирования шрифтов
export const fontsTask = () => {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
};

// Задача для запуска локального сервера и отслеживания изменений
export const serve = () => {
  bs.init({
    server: './dist'
  });

  gulp.watch(['src/pages/**/*.pug', 'src/components/**/*.pug'], pugTask);
  gulp.watch(['src/sass/**/*.scss', 'src/components/**/*.scss'], sassTask);
  gulp.watch(['src/js/**/*.js', 'src/components/**/*.js'], jsTask);
  gulp.watch('src/images/**/*', imagesTask);
  gulp.watch('src/fonts/**/*', fontsTask);
};

// Настройка для создания SVG-спрайта
export function sprite() {
  return gulp.src('src/images/svg/*.svg') // Путь к вашим SVG-иконкам
    .pipe(cheerio({
      run: function ($) {
        // // Удаляем ненужные атрибуты
        // $('[fill]').removeAttr('fill');
        // $('[stroke]').removeAttr('stroke');
        // $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgSprite({
      mode: {
        symbol: { // Создание спрайта в режиме <symbol>
          sprite: "../sprite.svg", // Имя файла спрайта
        }
      }
    }))
    .pipe(gulp.dest('dist/assets/images')); // Папка для сохранения спрайта
};

// Задача по умолчанию
export default gulp.series(pugTask, sassTask, jsTask, imagesTask, fontsTask, serve, sprite);

