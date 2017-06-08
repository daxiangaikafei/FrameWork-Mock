// -------------------------
// file source loading by es6
// -------------------------
import Router           from 'koa-router'
import indexCtrl        from '../controllers'
import qbiiCtrl         from '../controllers/qbii'
import nodeCtrl         from '../controllers/node'
import stuffCtrl        from '../controllers/stuff'
import machineCtrl      from '../controllers/machine'
import machineApiCtrl   from '../controllers/api'
import initCtrl         from '../controllers/init'
import shieldCtrl       from '../controllers/shield'
import userImagesCtrl   from '../controllers/userImages'
import goodsCtrl        from '../controllers/goods'
import redisUtil        from 'lib/redisUtil'
// -------------------------
// router instance 
// -------------------------
const router = Router()

// -------------------------
// business instance
// -------------------------
router.get('/index', indexCtrl)
router.get('/machine', machineCtrl)
router.get('/stuff', stuffCtrl)
router.get('/node', nodeCtrl)
router.get('/qbii', qbiiCtrl)
router.get('/init', initCtrl)
router.get('/shield', shieldCtrl)
router.get('/userImages', userImagesCtrl)
router.get('/goods', goodsCtrl)
router.post('/api/info', machineApiCtrl)

// -------------------------
// get post business api
// -------------------------

module.exports = function(ctx, next){

    var _json = JSON.parse(ctx.redis.apiPostList)
    for(var api of _json){
        router.post('/'+api.projectKey+'/'+api.apiKey, async function(ctx,next){
            ctx.body = JSON.parse(api.jsonValue)
        })
    }

    return router.routes()(ctx, next)
}
