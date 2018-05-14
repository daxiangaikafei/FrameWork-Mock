// -------------------------
// private file source loading by es6
// -------------------------
import ReturnObj            from 'model/return'
import mimes,{parseMime}    from 'lib/mimes'
import content              from 'lib/content'
import path                 from 'path'


// -------------------------
// base middleware
// -------------------------
module.exports = function(option){

    return async (ctx, next) => {

            try {

                // 静态资源目录在本地的绝对路径
                let fullStaticPath = path.resolve(__dirname, '../../../../public')

                // 获取静态资源内容，有可能是文件内容，目录，或404
                let _content = await content( ctx, fullStaticPath )
                
                // 解析请求内容的类型
                var _mime = parseMime( ctx.url )
                if( _mime && _mime.indexOf('json')== -1 ){
                    ctx.res.writeHead(200)
                    ctx.res.write(_content, 'binary')
                    ctx.res.end()
                }
                else{
                    var apiListKey = 'APIList',
                        apiList    = await ctx.redis.get(apiListKey),
                        jsonValueArr = [],
                        jsonOption = {},
                        returnObj  = {},
                        exist      = false;

                    if( apiList ){
                        apiList = JSON.parse(apiList)

                        var _router = ctx.request.url.match(/^.*(?=\?)/g),
                            _url    = _router ? _router[0] : ctx.request.url ,
                            _jsonp  = _router ? ctx.request.url.replace(/^.*(?:\?)/g,'') : null,
                            _jsonpP = _jsonp && _jsonp.indexOf('callbackparam')> -1  ? _jsonp.split('&') : null ;

                        for(var api of apiList){
                            let isRest = /:id/i.test(api.apiKey) && _url.indexOf(api.apiKey.replace(/\/:id/i,'')) >= 0
                            
                            if( (isRest || _url == '/' + api.projectKey + '/' + api.apiKey) && api.apiMethod == 1){
                                
                                var getAPIKeySQL = "select * from apiKey where apiId = " + api.aid ,
                                    APIKeyList   = await ctx.mysql.query(getAPIKeySQL)

                                if( APIKeyList && APIKeyList.length ){

                                    APIKeyList[0].jsonValue.length && 
                                   (jsonValueArr = APIKeyList[0].jsonValue.split('##option##')) &&
                                   (returnObj = JSON.parse(jsonValueArr[0])) &&
                                   (jsonOption = jsonValueArr[1] ? JSON.parse(jsonValueArr[1]) : {})
                                }

                                exist = true;
                                break;
                            }
                        }
                        
                        
                        if(exist){

                            
                            if(_jsonpP){

                                var _backFun = ''
                                for(var _p of _jsonpP){
                                    if( _p.split('=')[0] == 'callbackparam')
                                        _backFun = _p.split('=')[1]
                                    break;
                                }

                                ctx.status  = 200
                                ctx.res.write(_backFun + "('" + JSON.stringify(returnObj) + "')")
                                ctx.body    = ''
                            }
                            else {
                                ctx.status  = 200
                                
                                const { getMock } = await require(path.resolve(__dirname,'../../../mock/index.js'))
                                returnObj = getMock(returnObj, jsonOption)
                                if(ctx.method = 'POST' ){
                                    ctx.body = returnObj
                                    console.log('1:POST')
                                }
                                else if(ctx.method = 'GET' ){
                                    ctx.body = returnObj
                                    // ctx.json
                                }          
                            }  
                        }
                        else await next()
                    }
                    else  await next()

                }
            } 
            catch (err) {

                if (err == null) {
                    err = new Error('System Error!');
                }
                var obj  = new ReturnObj({
                    code : err.status || 500,
                    message : err.stack
                })
                ctx.status = ctx.status
                ctx.body = obj
            }
    }

}
