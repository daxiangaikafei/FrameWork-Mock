import util        from 'util'

module.exports =  async function(ctx){

        // -------------------------
        // business const
        // -------------------------
        var APIList_Key = 'APIList'
        var Get_ProjectAPI = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,p.projectName,p.projectKey,p.authDomain from api a left join project p on a.projectId = p.id"

        var ProjectList_Key = 'ProjectList'
        var Get_Project = "select * from project"

        // console.log('------------------------------------APIList1',APIList)
        // -------------------------
        // project gettings
        // -------------------------
        var APIList = await ctx.mysql.query(util.format(Get_ProjectAPI)),
            APIList = JSON.stringify(APIList),
            ProjectList = await ctx.mysql.query(util.format(Get_Project)),
            ProjectList = JSON.stringify(ProjectList);

            console.log('------------------------------------APIListMySQL',APIList)
            console.log('------------------------------------ProjectListMySQL',ProjectList)

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
            getAPIListPUT(ctx);
            getAPIListDelete(ctx);
            getAPIListPatch(ctx);
            getAPIListUpdate(ctx);
            return _result;
        }
        else {
            var _result = await ctx.redis.del(APIList_Key);
            if( _result ){
                _result = await ctx.redis.set(APIList_Key,APIList,{expire:3600*24*30});
                getAPIListGET(ctx);
                getAPIListPOST(ctx);
                getAPIListPUT(ctx);
                getAPIListDelete(ctx);
                getAPIListPatch(ctx);
                getAPIListUpdate(ctx);
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

var getAPIListPUT  =  async function(ctx){
    
            // -------------------------
            // business const
            // -------------------------
            var getAPIList  = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,jsonValue,p.projectName,p.projectKey,p.id as pid "
                            + "from api a left join project p on a.projectId = p.id left join apiKey ak on a.id = ak.apiId "
                            + "where  apiMethod = 3"
    
            // -------------------------
            // api gettings
            // -------------------------
            var APIList_Key_Put = 'APIList_Put',
                APIList = await ctx.mysql.query(getAPIList);
    
            if( await ctx.redis.get(APIList_Key_Put)){
                await ctx.redis.del(APIList_Key_Put);
            }
            var _result = await ctx.redis.set(APIList_Key_Put,JSON.stringify(APIList),{expire:3600*24*30});
            return APIList;
    }

var getAPIListDelete  =  async function(ctx){
        
                // -------------------------
                // business const
                // -------------------------
                var getAPIList  = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,jsonValue,p.projectName,p.projectKey,p.id as pid "
                                + "from api a left join project p on a.projectId = p.id left join apiKey ak on a.id = ak.apiId "
                                + "where  apiMethod = 4"
        
                // -------------------------
                // api gettings
                // -------------------------
                var APIList_Key_Delete = 'APIList_Delete',
                    APIList = await ctx.mysql.query(getAPIList);
        
                if( await ctx.redis.get(APIList_Key_Delete)){
                    await ctx.redis.del(APIList_Key_Delete);
                }
                var _result = await ctx.redis.set(APIList_Key_Delete,JSON.stringify(APIList),{expire:3600*24*30});
                return APIList;
    }

var getAPIListPatch  =  async function(ctx){
        
                // -------------------------
                // business const
                // -------------------------
                var getAPIList  = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,jsonValue,p.projectName,p.projectKey,p.id as pid "
                                + "from api a left join project p on a.projectId = p.id left join apiKey ak on a.id = ak.apiId "
                                + "where  apiMethod = 5"
        
                // -------------------------
                // api gettings
                // -------------------------
                var APIList_Key_Patch = 'APIList_Patch',
                    APIList = await ctx.mysql.query(getAPIList);
        
                if( await ctx.redis.get(APIList_Key_Patch)){
                    await ctx.redis.del(APIList_Key_Patch);
                }
                var _result = await ctx.redis.set(APIList_Key_Patch,JSON.stringify(APIList),{expire:3600*24*30});
                return APIList;
}
var getAPIListUpdate  =  async function(ctx){
    
            // -------------------------
            // business const
            // -------------------------
            var getAPIList  = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,jsonValue,p.projectName,p.projectKey,p.id as pid "
                            + "from api a left join project p on a.projectId = p.id left join apiKey ak on a.id = ak.apiId "
                            + "where  apiMethod = 6"
    
            // -------------------------
            // api gettings
            // -------------------------
            var APIList_Key_Update = 'APIList_Update',
                APIList = await ctx.mysql.query(getAPIList);
    
            if( await ctx.redis.get(APIList_Key_Update)){
                await ctx.redis.del(APIList_Key_Update);
            }
            var _result = await ctx.redis.set(APIList_Key_Update,JSON.stringify(APIList),{expire:3600*24*30});
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