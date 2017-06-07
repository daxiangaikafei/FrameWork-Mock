// -------------------------
// file alias
// -------------------------
require('module-alias/register')

// -------------------------
// file source
// -------------------------
var babelCliDir  = require('babel-cli/lib/babel/dir')
var babelCliFile = require('babel-cli/lib/babel/file')
var chokidar     = require('chokidar')
var path         = require('path')
var watcher      = chokidar.watch(path.join(__dirname,'../src'))

// -------------------------
// const source
// -------------------------
const config     = require('../config')
const debugBin   = require('debug')('app:bin')

// -------------------------
// development env
// -------------------------
debugBin(`source loading ended, apply enviroment: "${process.env.NODE_ENV}"`)
process.env.NODE_ENV === 'development' && 
watcher.on('ready',function(){

    // -------------------------
    // babel setting :  keep line number when compiled
    // app  starting 
    // -------------------------
    debugBin(`watcher ready , compiled starting .....`)
    babelCliDir({
        outDir      : 'dist/',
        retainLines : true ,
        sourceMap   : true 
    },['src/'])
    require(`../dist`)(config)
    debugBin(`app starting ..........................`)

    // -------------------------
    // monitor source 
    // -------------------------
    watcher
    .on('add', function (absPath) {
        compileFile(path.relative(config.abs_src, absPath), cacheClean)
    })
    .on('change', function (absPath) {
        compileFile(path.relative(config.abs_src, absPath), cacheClean)
    })
    .on('unlink', function (absPath) {
        var rmfileRelative = path.relative(config.abs_src, absPath)
        var rmfile = path.join(config.abs_dist, rmfileRelative)

        try {
            fs.unlinkSync(rmfile)
            fs.unlinkSync(rmfile + '.map')
        } catch (e) {
            debugBin('fail to unlink', rmfile)
            return
        }

        console.log('Deleted', rmfileRelative)
        cacheClean()
    })
})
// -------------------------
// production env
// -------------------------
if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'){
    require(`../dist`)(config)
}




// -------------------------
// compile setting 
// -------------------------
function compileFile (filename, cb) {
    var srcFile = path.join(config.dir_src, filename)
    var outFile = path.join(config.dir_dist, filename)
    try {
        babelCliFile({
            outFile: outFile,
            retainLines: true,
            highlightCode: true,
            comments: true,
            babelrc: true,
            sourceMaps: true
        }, [ srcFile ], { highlightCode: true, comments: true, babelrc: true, ignore: [], sourceMaps: true })
    } catch (e) {
        console.error('Error while compiling file %s', filename, e)
        return
    }
    console.log('-----------------------------------------------------')
    console.log(`file source changing: ${srcFile}  to destination category: ${outFile} `)
    cb && cb()
}

// -------------------------
// cache setting 
// -------------------------
 function cacheClean () {
  Object.keys(require.cache).forEach(function (id) {
    if (/[\/\\](dist)[\/\\]/.test(id)) {
      delete require.cache[id]
    }
  })
  console.log('App Cache Cleaned...')
  console.log('-----------------------------------------------------')
 }



