/* eslint-env node */
const gulp = require('gulp')
const gutil = require('gulp-util')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const header = require('gulp-header')
const webpack = require('webpack')
const Testem = require('testem')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const del = require('del')
const run = require('run-sequence')

gulp.task('clean', () => {
  return del(['.tmp', 'dist', 'dist-examples'])
})

gulp.task('webpack', (done) => {
  webpack(require('./webpack.config'), (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString())
    done()
  })
})

gulp.task('webpack:dev', () => {
  const compiler = webpack(require('./webpack.config.dev'))

  compiler.watch(200, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString())
  })
})

gulp.task('webpack:test', () => {
  const compiler = webpack(require('./webpack.config.test'))

  compiler.watch(200, (err) => {
    if (err) throw new gutil.PluginError('webpack', err)
  })
})

gulp.task('webpack:example', (done) => {
  const files = glob.sync('examples/*/main.js')
  const entry = {}
  files.forEach(f => {
    const name = f.split('/').slice(-2)[0]
    entry[name] = `./${name}/main.js`
  })

  const config = Object.assign({}, require('./webpack.config'), {
    context: path.resolve(__dirname, 'examples'),
    entry,
    output: {
      path: path.resolve(__dirname, 'dist-examples'),
      filename: '[name]/main.js'
    },
    externals: {}
  })

  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString())
    done()
  })
})

gulp.task('testem', () => {
  const testem = new Testem()
  testem.startDev(yaml.safeLoad(fs.readFileSync(__dirname + '/testem.yml')))
})

gulp.task('uglify', () => {
  return gulp.src(['dist/**/*.js', '!**/*.min.js'])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('header', () => {
  return gulp.src(['dist/**/*.js'])
    .pipe(header(fs.readFileSync('./BANNER', 'utf-8'), require('./package.json')))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', ['clean'], (done) => {
  run('webpack', 'uglify', 'header', done)
})

gulp.task('build:example', ['clean', 'webpack:example'], () => {
  return gulp.src(['examples/**/*.html', 'examples/**/*.css'])
    .pipe(gulp.dest('dist-examples'))
})

gulp.task('test', ['webpack:test', 'testem'])
gulp.task('default', ['webpack:dev'])
