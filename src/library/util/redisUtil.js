// -------------------------
// public file source loading by es6
// -------------------------
import redis      from 'redis'
import wrapper    from 'co-redis'
import { config } from 'QBFK'

// -------------------------
// init the redis client
// -------------------------
var _redisClient  = redis.createClient(config.redis_url, {})
const redisClient = wrapper(_redisClient)

redisClient.on("error", function(error) {
    console.log(error);
});

let redisAvailable = false;
var start =function(){
    return new Promise(function(resolve,reject){
        try{
            redisClient.on('connect', () => {
                redisAvailable = true;
                resolve(redisAvailable)
            })
        }catch(e){
            reject(e)
        }
    })
}
start();

// -------------------------
// redis function prototype
// -------------------------
module.exports = function(options){

    const middleOptions = options || {}
    const prefix = middleOptions.prefix || config.prefix;
    const expire = middleOptions.expire || config.expire;
    
    

    // -------------------------
    // redis function set
    // -------------------------
    const setCache = 
    async function(key, value, cacheOptions) {

      if(!redisAvailable || value == null){
        await start();
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
          await start();
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
          await start();
      }
      
      key = prefix + key
      await redisClient.del(key)
      return true
    }

    return {
          get : getCache,
          set : setCache,
          del : delCache
      }
}
