import ReturnObj   from 'model/return'
import QBFK        from 'QBFK'
import fs          from 'fs'
import util        from 'util'
import business    from 'business/api'

// -------------------------
// this is a demo 
// -------------------------
module.exports = async (ctx, next) => {

    // -------------------------
    // business const
    // -------------------------
    var APIList_Key = 'APIList'
    var Get_ProjectAPI = "select a.id aid,apiName,apiDesc,apiKey,p.projectName,p.projectKey from api a left join project p on a.projectId = p.id"

    // -------------------------
    // project gettings
    // -------------------------
    business(ctx)
    
     ctx.body = ctx.render('init',{
         title:'redis | 初始化',
         result:'初始化成功!'
     })
        
}