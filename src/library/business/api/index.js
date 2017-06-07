import util        from 'util'

module.exports =  async function(ctx){

        // -------------------------
        // business const
        // -------------------------
        var APIList_Key = 'APIList'
        var Get_ProjectAPI = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,p.projectName,p.projectKey,p.authDomain from api a left join project p on a.projectId = p.id"

        var ProjectList_Key = 'ProjectList'
        var Get_Project = "select * from project"


        // -------------------------
        // project gettings
        // -------------------------
        var APIList = await ctx.mysql.query(util.format(Get_ProjectAPI)),
            APIList = JSON.stringify(APIList),
            ProjectList = await ctx.mysql.query(util.format(Get_Project)),
            ProjectList = JSON.stringify(ProjectList);

        var pro = await ctx.redis.get(ProjectList_Key);
        if( pro == null ){
            await ctx.redis.set(ProjectList_Key,ProjectList,{expire:3600*24*30});
        }
        else {
            var _result = await ctx.redis.del(ProjectList_Key);
            if( _result ){
                await ctx.redis.set(ProjectList_Key,ProjectList,{expire:3600*24*30});
            }
        }



        var api = await ctx.redis.get(APIList_Key);
        if( api == null ){
            var _result = await ctx.redis.set(APIList_Key,APIList,{expire:3600*24*30});
            getAPIListGET(ctx);
            getAPIListPOST(ctx);
            return _result;
        }
        else {
            var _result = await ctx.redis.del(APIList_Key);
            if( _result ){
                _result = await ctx.redis.set(APIList_Key,APIList,{expire:3600*24*30});
                getAPIListGET(ctx);
                getAPIListPOST(ctx);
                return _result;
            }
        }


        


}

var getAPIListGET =  async function(ctx){

        // -------------------------
        // business const
        // -------------------------
        var getAPIList  = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,p.projectName,p.projectKey,p.id as pid "
                        + "from api a left join project p on a.projectId = p.id "
                        + "where  apiMethod =1"

        // -------------------------
        // api gettings
        // -------------------------
        var APIList_Key_GET = 'APIList_GET',
            APIList = await ctx.mysql.query(getAPIList);

        if( await ctx.redis.get(APIList_Key_GET)){
            await ctx.redis.del(APIList_Key_GET);
        }
        var _result = await ctx.redis.set(APIList_Key_GET,JSON.stringify(APIList),{expire:3600*24*30});
        return APIList;
}

var getAPIListPOST  =  async function(ctx){

        // -------------------------
        // business const
        // -------------------------
        var getAPIList  = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,jsonValue,p.projectName,p.projectKey,p.id as pid "
                        + "from api a left join project p on a.projectId = p.id left join apiKey ak on a.id = ak.apiId "
                        + "where  apiMethod = 2"

        // -------------------------
        // api gettings
        // -------------------------
        var APIList_Key_POST = 'APIList_POST',
            APIList = await ctx.mysql.query(getAPIList);

        if( await ctx.redis.get(APIList_Key_POST)){
            await ctx.redis.del(APIList_Key_POST);
        }
        var _result = await ctx.redis.set(APIList_Key_POST,JSON.stringify(APIList),{expire:3600*24*30});
        return APIList;
}

module.exports.getAPIList  =  async function(ctx,business){

        // -------------------------
        // business const
        // -------------------------
        var getAPIList  = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,p.projectName,p.projectKey,p.id as pid "
                        + "from api a left join project p on a.projectId = p.id "
                        + "where projectName = '%s'"

        if(business.apiName && business.apiName.length){
            getAPIList += "and apiName like '%"+ business.apiName +"%'";
        }
        // -------------------------
        // project gettings
        // -------------------------
        return await ctx.mysql.query(util.format(getAPIList,business.projectName));
}