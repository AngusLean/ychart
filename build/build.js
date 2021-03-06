/*eslint-disable*/
var fs = require('fs')
var zlib = require('zlib')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var replace = require('rollup-plugin-replace')
var version = process.env.VERSION || require('../package.json').version

var banner =
  '/*!\n' +
  ' * Yhart.js v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' AngusLean\n' +
  ' * Released under the MIT License.\n' +
  ' */'

// update main file
var main = fs
  .readFileSync('src/index.js', 'utf-8')
  .replace(/ychart\.version = '[\d\.]+'/, "ychart.version = '" + version + "'")
fs.writeFileSync('src/index.js', main)

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      loose: 'all'
    })
  ]
})
.then(function (bundle) {
  return write('dist/ychart.common.js', bundle.generate({
    format: 'cjs',
    banner: banner
  }).code)
})
// Standalone Dev Build
.then(function () {
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      replace({
        'process.env.NODE_ENV': "'development'"
      }),
      babel({
        loose: 'all'
      })
    ]
  })
  .then(function (bundle) {
    return write('dist/ychart.js', bundle.generate({
      format: 'umd',
      banner: banner,
      moduleName: 'ychart'
    }).code)
  })
})
.then(function () {
  // Standalone Production Build
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      replace({
        'process.env.NODE_ENV': "'production'"
      }),
      babel({
        loose: 'all'
      })
    ]
  })
  .then(function (bundle) {

    var code = bundle.generate({
      format: 'umd',
      moduleName: 'ychart',
      banner: banner
    }).code
    var res = uglify.minify(code, {
      fromString: true,
      outSourceMap: 'ychart.min.js.map',
      output: {
        preamble: banner,
        ascii_only: true
      }
    })
    // fix uglifyjs sourcemap
    var map = JSON.parse(res.map)
    map.sources = ['ychart.js']
    map.sourcesContent = [code]
    map.file = 'ychart.min.js'
    return [
      write('dist/ychart.min.js', res.code),
      write('dist/ychart.min.js.map', JSON.stringify(map))
    ]
  })
  .then(zip)
})
.catch(logError)

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}

function zip () {
  return new Promise(function (resolve, reject) {
    fs.readFile('dist/ychart.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/ychart.min.js.gz', buf).then(resolve)
      })
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
/* eslint-enable*/
