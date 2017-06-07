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

    // Raven.config('http://be75c559773e4e9f83faca1a4aebe7ea:1a5349ab38004ded9a737ce58ef8d2a3@10.172.31.185:9000/6').install();
    // Raven.config('http://d60630bca44b42588bee54fadc57f242:2918f4601d2541d5a0f4e66fbc18adf4@127.0.0.1:9000/2').install();

    // var err = {};
    // Raven.captureException(JSON.stringify(Business), function (err, eventId) {
    //     console.log('Reported error ' + JSON.stringify(Business));
    // });

     ctx.body = ctx.render('index',{
         title:'藤榕前端｜Mock环境',
         products:Business,
         projects:project
     })
        
}