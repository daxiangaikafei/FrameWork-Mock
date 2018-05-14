import ReturnObj   from 'model/return'
import QBFK        from 'QBFK'
import fs          from 'fs'
import util        from 'util'
import Router      from 'koa-router'
// import Raven       from 'raven'

// -------------------------
// router instance 
// -------------------------
const router = Router()

// -------------------------
// this is a demo 
// -------------------------
module.exports = async (ctx, next) => {

    // -------------------------
    // business const
    // -------------------------
    var Get_Business = 'select * from business;'
    var Get_Project  = 'select * from project where businessId = %d;'

    // -------------------------
    // project getting
    // -------------------------
    var Business = await ctx.mysql.query(Get_Business);
    var project = []
    if( Business.length ){
        for(var business of Business){
            var _d = await ctx.mysql.query(util.format(Get_Project,business.id));
            project.push(_d)
        }
    }

    // var err = {};
    // Raven.captureException(JSON.stringify(Business), function (err, eventId) {
    //     console.log('Reported error ' + JSON.stringify(Business));
    // });

     ctx.body = ctx.render('index',{
         title:'途虎大前端｜Mock环境',
         products:Business,
         projects:project
     })
        
}