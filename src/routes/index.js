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
// get post business api util
// -------------------------
var postUtil = function (opt) {
    Object.assign(this, opt);
}
postUtil.prototype = {
    constructor: this,
    filterTarget: function (_api, _actualUrl) {
        return _api.filter(function (_item) {
            return '/' + _item.projectKey + '/' + _item.apiKey == _actualUrl
        })
    }
}

// -------------------------
// get post business api
// -------------------------
module.exports = function (ctx, next) {

    //para init 
    var _postUtil = new postUtil(),
        _json = JSON.parse(ctx.redis.apiPostList),
        api = _postUtil.filterTarget(_json, ctx.request.url);

    if (api && api.length) {
        api = api[0];

        // this is a function ,care the closet function using 
        router.post('/' + api.projectKey + '/' + api.apiKey, async function (ctx, next) {

            var _jsonList = JSON.parse(ctx.redis.apiPostList),
                _jsonTarget = _postUtil.filterTarget(_jsonList, ctx.request.url);

            //  find the target api
            if (_jsonTarget) {
                _jsonTarget = _jsonTarget[0];

                // get the the jsonValue by regular
                var _result = _jsonTarget.jsonValue.match(/##option.+/)
                if (_result) {

                    // filter the option ,and then response the value 
                    var returnValue = JSON.parse(_jsonTarget.jsonValue.replace(/##option.+/g, ''));
                    ctx.body = returnValue;
                    ctx.set('option', _result[0].replace('##option##', ''));

                }
                else ctx.body = JSON.parse(_jsonTarget.jsonValue)
            }
            else {
                ctx.body = {
                    code: -9999,
                    msg: '路由: ' + ctx.request.url + ' 不存在',
                    data: null
                }
            }

        })
    }

    return router.routes()(ctx, next)
}
