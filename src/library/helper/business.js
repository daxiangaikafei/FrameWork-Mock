import util        from 'util'

module.exports =  async function(ctx){

        // -------------------------
        // business const
        // -------------------------
        var APIList_Key = 'APIList'
        var Get_ProjectAPI = "select a.id aid,apiName,apiDesc,apiKey,p.projectName,p.projectKey from api a left join project p on a.projectId = p.id"

        // -------------------------
        // project gettings
        // -------------------------
        var APIList = await ctx.mysql.query(util.format(Get_ProjectAPI)),
            APIList = JSON.stringify(APIList);

        var api = await ctx.redis.get(APIList_Key);
        if( api == null ){
            var _result = await ctx.redis.set(APIList_Key,APIList,{expire:3600*24*30});
            return _result;
        }
        else {
            var _result = await ctx.redis.del(APIList_Key);
            if( _result ){
                _result = await ctx.redis.set(APIList_Key,APIList,{expire:3600*24*30});
                return _result;
            }
        }
}