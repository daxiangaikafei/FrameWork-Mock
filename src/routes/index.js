// -------------------------
// file source loading by es6
// -------------------------
import Router from 'koa-router'
import indexCtrl from '../controllers'
import initCtrl from '../controllers/init'
import apiCtrl from '../controllers/api'

// -------------------------
// business loading by es6
// -------------------------
import tireCtrl from '../controllers/tire'
import mantCtrl from '../controllers/mant'
import washCtrl from '../controllers/wash'
import oilCtrl from '../controllers/oil'
import violateCtrl from '../controllers/violate'

import wxtireCtrl from '../controllers/wxtire'
import wxmantCtrl from '../controllers/wxmant'
import wxwashCtrl from '../controllers/wxwash'
import wxoilCtrl from '../controllers/wxoil'
import wxviolateCtrl from '../controllers/wxviolate'

import frameworkCtrl from '../controllers/framework'
import huaweiCtrl from '../controllers/huawei'
import miCtrl from '../controllers/mi'

import hookCtrl from '../controllers/hook'


// -------------------------
// router instance 
// -------------------------
const router = Router()

// -------------------------
// business instance
// -------------------------
router.get('/index', indexCtrl)
router.get('/init', initCtrl)
router.post('/api/info', apiCtrl)

router.get('/tire', tireCtrl)
router.get('/mant', mantCtrl)
router.get('/wash', washCtrl)
router.get('/oil', oilCtrl)
router.get('/violate', violateCtrl)

router.get('/wxtire', wxtireCtrl)
router.get('/wxmant', wxmantCtrl)
router.get('/wxwash', wxwashCtrl)
router.get('/wxoil', wxoilCtrl)
router.get('/wxviolate', wxviolateCtrl)

router.get('/framework', frameworkCtrl)
router.get('/huawei', huaweiCtrl)
router.get('/mi', miCtrl)

router.post('/hook', hookCtrl)

router.post('/frontEndBuild', hookCtrl)



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
        _jsonPut = JSON.parse(ctx.redis.apiPutList),
        _jsonDelete = JSON.parse(ctx.redis.apiDeleteList),
        _jsonPatch = JSON.parse(ctx.redis.apiPatchList),
        _jsonUpdate = JSON.parse(ctx.redis.apiUpdateList);

    // console.log('_json_jsonPut--------------------------------',_jsonPut);
    // console.log('_json_jsonDelete--------------------------------',_jsonDelete);
    // console.log('_json_jsonPatch--------------------------------',_jsonPatch);
    // console.log('_json_jsonUpdate--------------------------------',_jsonUpdate);

    if (_json == null && _jsonPut == null && _jsonDelete == null && _jsonPatch == null && _jsonUpdate == null)
        return router.routes()(ctx, next);

    /* -------------------------------- post --------------------------------*/
    var api = _postUtil.filterTarget(_json, ctx.request.url);
    if (api && api.length) {
        api = api[0];

        // this is a function ,care the closet function using 
        router.post('/' + api.projectKey + '/' + api.apiKey, async function (ctx, next) {

            var _jsonList = JSON.parse(ctx.redis.apiPostList),
                _jsonTarget = _postUtil.filterTarget(_jsonList, ctx.request.url);

            //  find the target api
            if (_jsonTarget && _jsonTarget[0]) {
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
                    isSuccess: false,
                    code: 404,
                    message: "this is a 404 return value",
                    data: null
                }
            }

        })
    }

    /* -------------------------------- put --------------------------------*/
    api = _postUtil.filterTarget(_jsonPut, ctx.request.url);
    if (api && api.length) {
        api = api[0];

        // this is a function ,care the closet function using 
        router.put('/' + api.projectKey + '/' + api.apiKey, async function (ctx, next) {

            var _jsonList = JSON.parse(ctx.redis.apiPutList),
                _jsonTarget = _postUtil.filterTarget(_jsonList, ctx.request.url);

            //  find the target api
            if (_jsonTarget && _jsonTarget[0]) {
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
                    isSuccess: false,
                    code: 404,
                    message: "this is a 404 return value",
                    data: null
                }
            }

        })
    }

    /* -------------------------------- Delete --------------------------------*/
    api = _postUtil.filterTarget(_jsonDelete, ctx.request.url);
    if (api && api.length) {
        api = api[0];

        // this is a function ,care the closet function using 
        router.delete('/' + api.projectKey + '/' + api.apiKey, async function (ctx, next) {

            var _jsonList = JSON.parse(ctx.redis.apiDeleteList),
                _jsonTarget = _postUtil.filterTarget(_jsonList, ctx.request.url);

            //  find the target api
            if (_jsonTarget && _jsonTarget[0]) {
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
                    isSuccess: false,
                    code: 404,
                    message: "this is a 404 return value",
                    data: null
                }
            }

        })
    }

    /* -------------------------------- Patch --------------------------------*/
    api = _postUtil.filterTarget(_jsonPatch, ctx.request.url);
    if (api && api.length) {
        api = api[0];

        // this is a function ,care the closet function using 
        router.patch('/' + api.projectKey + '/' + api.apiKey, async function (ctx, next) {

            var _jsonList = JSON.parse(ctx.redis.apiPatchList),
                _jsonTarget = _postUtil.filterTarget(_jsonList, ctx.request.url);

            //  find the target api
            if (_jsonTarget && _jsonTarget[0]) {
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
                    isSuccess: false,
                    code: 404,
                    message: "this is a 404 return value",
                    data: null
                }
            }

        })
    }


    /* -------------------------------- Update --------------------------------*/
    //  api = _postUtil.filterTarget(_jsonUpdate, ctx.request.url);
    //  if (api && api.length) {
    //     api = api[0];

    //     // this is a function ,care the closet function using 
    //     router.update('/' + api.projectKey + '/' + api.apiKey, async function (ctx, next) {

    //         var _jsonList = JSON.parse(ctx.redis.apiUpdateList),
    //             _jsonTarget = _postUtil.filterTarget(_jsonList, ctx.request.url);

    //         //  find the target api
    //         if (_jsonTarget) {
    //             _jsonTarget = _jsonTarget[0];

    //             // get the the jsonValue by regular
    //             var _result = _jsonTarget.jsonValue.match(/##option.+/)
    //             if (_result) {

    //                 // filter the option ,and then response the value 
    //                 var returnValue = JSON.parse(_jsonTarget.jsonValue.replace(/##option.+/g, ''));
    //                 ctx.body = returnValue;
    //                 ctx.set('option', _result[0].replace('##option##', ''));

    //             }
    //             else ctx.body = JSON.parse(_jsonTarget.jsonValue)
    //         }
    //         else {
    //             ctx.body = {
    //                 code: -9999,
    //                 msg: '路由: ' + ctx.request.url + ' 不存在',
    //                 data: null
    //             }
    //         }

    //     })
    // }

    return router.routes()(ctx, next)
}
