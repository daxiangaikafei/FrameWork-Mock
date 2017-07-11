// -------------------------
// public file source loading by es6
// -------------------------
import redis      from 'redis'
import wrapper    from 'co-redis'
import { config } from 'QBFK'

// -------------------------
// init the redis client
// -------------------------
var _redisClient = redis.createClient(config.redis_url, {})

// -------------------------
// redis function prototype
// -------------------------
module.exports = function(options){

    const middleOptions = options || {}
    const prefix = middleOptions.prefix || config.prefix;
    const expire = middleOptions.expire || config.expire;
    const redisClient = wrapper(_redisClient);

    let redisAvailable = false;

    redisClient.on('connect', () => {
      redisAvailable = true;
    })

    // -------------------------
    // redis function set
    // -------------------------
    const setCache = 
    async function(key, value, cacheOptions) {

      if(!redisAvailable || value == null){
        return false
      }
    
      const currentOptions = cacheOptions || {};
      const tty = currentOptions.expire || expire;
      key = prefix + key
      await redisClient.setex(key, tty, value)
      return true
    }

    // -------------------------
    // redis function get
    // -------------------------
    const getCache = 
    async function(key){

      if(!redisAvailable){
          return null
      }
      
      key = prefix + key
      let data = await redisClient.get(key)
      return data
    }

    // -------------------------
    // redis function del
    // -------------------------
    const delCache = 
    async function(key){

      if(!redisAvailable){
          return false
      }
      
      key = prefix + key
      await redisClient.del(key)
      return true
    }

    return async (ctx , next) => {

      let proList     = await getCache('ProjectList')
      let apiPostList = await getCache('APIList_POST')

      // console.log('------------------------------------apiPostList',apiPostList)
      

    // for(var api of ret){
    //     _router.post('/'+api.projectKey+'/'+api.apiKey, async function(ctx,next){
    //         console.log('0:POST')
    //         ctx.body = JSON.parse(api.jsonValue)
    //     })
    // }


      ctx.redis = {
          get : getCache,
          set : setCache,
          del : delCache,
          proList :proList,
          apiPostList :apiPostList
      }

      // if(ctx.redis&& ctx.redis.apiPostList){
      //     console.log('------------------------------------ctx',ctx.redis.apiPostList)
      // }
      await next()
    }
}
