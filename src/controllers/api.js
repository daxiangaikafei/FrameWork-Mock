import ReturnObj from 'model/return'
import QBFK from 'QBFK'
import fs from 'fs'
import util from 'util'
import Router from 'koa-router'
import business, { getAPIList } from 'business/api'

// -------------------------
// router instance 
// -------------------------
const router = Router()

// -------------------------
// api function set
// -------------------------
module.exports = async (ctx, next) => {

    // -------------------------
    // init data
    // -------------------------
    var body = ctx.request.body,
        api = {
            apiName: body.apiName,
            apiKey: body.apiKey,
            apiDesc: body.apiDesc,
            projectId: body.projectId,
            apiMethod: body.apiMethod
        },
        apiKey = {
            jsonValue: body.jsonValue
        }

    // -------------------------
    // main logic
    // -------------------------
    try {

        // -------------------------
        // return a single data
        // -------------------------
        if (body.requestId) {
            var getAPIDetail = " select a.id aid,apiName,apiDesc,apiKey,jsonValue,apiMethod "
                + " from api a left join apiKey ak on a.id = ak.apiId "
                + " where a.id = %d ",
                apiResult = await ctx.mysql.query(util.format(getAPIDetail, body.requestId))

            ctx.body = apiResult[0]
        }

        // -------------------------
        // delete an api
        // -------------------------
        if (body.deleteId) {

            var deleteAPI = "delete from api where id = %d ;",
                deleteAPIKey = "delete from apiKey where apiId = %d ;";

            var apiResult = await ctx.mysql.query(util.format(deleteAPI, body.deleteId))
            apiResult = await ctx.mysql.query(util.format(deleteAPIKey, body.deleteId))

            business(ctx)
            // -------------------------
            // project gettings
            // -------------------------
            var APIList = await getAPIList(ctx, body)

            ctx.body = {
                success: true,
                code: 0,
                message: '',
                data: {
                    APIList
                }
            }
        }

        // -------------------------
        // update api domain
        // -------------------------
        else if (body.updateDoMainId > 0) {

            var apiResult = await ctx.mysql.update('project', { authDomain: body.authDomain }, { id: body.updateDoMainId });
            if (apiResult && apiResult.affectedRows) {

                business(ctx)
                ctx.body = {
                    success: true,
                    code: 0,
                    data: null,
                    message: '域名设置更新成功！'
                }
            }
        }

        // -------------------------
        // add an api
        // -------------------------
        else if (body.id == 0) {

            var apiResult = await ctx.mysql.insert('api', api);
            if (apiResult && apiResult.insertId) {
                apiKey.apiId = apiResult.insertId

                var apiKeyResult = await ctx.mysql.insert('apiKey', apiKey);
                if (apiKeyResult && apiKeyResult.insertId) {

                    business(ctx)
                    ctx.body = {
                        success: true,
                        code: 0,
                        data: null,
                        message: '' + body.apiName + ' 新增成功！'
                    }
                }
            }
        }

        // -------------------------
        // update an api
        // -------------------------
        else if (body.id > 0) {

            var apiResult = await ctx.mysql.update('api', api, { id: body.id });
            if (apiResult && apiResult.affectedRows) {

                var apiKeyResult = await ctx.mysql.update('apiKey', apiKey, { apiId: body.id });
                if (apiKeyResult && apiKeyResult.affectedRows) {

                    business(ctx)
                    ctx.body = {
                        success: true,
                        code: 0,
                        data: null,
                        message: '' + body.apiName + ' 更新成功！'
                    }
                }
            }
        }

        // -------------------------
        // return api list
        // -------------------------
        else if (body.id < 0) {

            // -------------------------
            // project gettings
            // -------------------------
            var APIList = await getAPIList(ctx, body)

            ctx.body = {
                success: true,
                code: 0,
                data: {
                    APIList
                },
                message: ''
            }
        }


    }
    catch (e) {

        // -------------------------
        // system error
        // -------------------------
        ctx.body = {
            success: false,
            code: 9999,
            data: null,
            message: e.message
        }
    }
}