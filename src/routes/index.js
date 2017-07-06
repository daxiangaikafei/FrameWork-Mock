// -------------------------
// file source loading by es6
// -------------------------
import Router from 'koa-router'
import indexCtrl from '../controllers'
import qbiiCtrl from '../controllers/qbii'
import nodeCtrl from '../controllers/node'
import stuffCtrl from '../controllers/stuff'
import machineCtrl from '../controllers/machine'
import machineApiCtrl from '../controllers/api'
import initCtrl from '../controllers/init'
import shieldCtrl from '../controllers/shield'
import userImagesCtrl from '../controllers/userImages'
import goodsCtrl from '../controllers/goods'
import risksCtrl from '../controllers/risks'
import redisUtil from 'lib/redisUtil'
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
router.get('/risks', risksCtrl)
router.post('/api/info', machineApiCtrl)

// -------------------------
// get post business api
// -------------------------

module.exports = function (ctx, next) {

    var _json = JSON.parse(ctx.redis.apiPostList)
    for (var api of _json) {
        router.post('/' + api.projectKey + '/' + api.apiKey, async function (ctx, next) {
            
            var _result = api.jsonValue.match(/##option.+/)
            if (_result) {
                api.jsonValue = api.jsonValue.replace(/##option.+/g, '')
                var returnValue = JSON.parse(api.jsonValue);
                // returnValue.option = JSON.parse(_result[0].replace('##option##', ''));
                ctx.body = returnValue;
                ctx.set('option', _result[0].replace('##option##', ''));
            }
            else ctx.body = JSON.parse(api.jsonValue)
        })
    }

    return router.routes()(ctx, next)
}
