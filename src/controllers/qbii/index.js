import ReturnObj   from 'model/return'
import QBFK        from 'QBFK'
import fs          from 'fs'
import util        from 'util'
import Router      from 'koa-router'

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
    var projectId      = 3
    var Get_ProjectAPI = "select a.id aid,apiName,apiDesc,apiKey,apiMethod,p.projectName,p.projectKey,p.id as pid from api a left join project p on a.projectId = p.id where p.id = %s"
    var Get_Project = "select projectName,authDomain,projectKey,id from project where id = %s"
    // -------------------------
    // project gettings
    // -------------------------
    var APIList = await ctx.mysql.query(util.format(Get_ProjectAPI,projectId));
    var Project = await ctx.mysql.query(util.format(Get_Project,projectId));
     ctx.body = ctx.render('api',{
         title:(Project.length?Project[0].projectName:'')+' | API列表',
         projectName : Project.length?Project[0].projectName:'',
         authDomain:Project.length?Project[0].authDomain:'',
         projectId,
         APIList
     })        
}