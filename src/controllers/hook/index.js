import ReturnObj from 'model/return'
import QBFK from 'QBFK'
import util from 'util'
import Router from 'koa-router'
import path from 'path'
import shell from 'shelljs'
import fs from 'fs'
import mail from './mail'
// -------------------------
// router instance 
// -------------------------
const router = Router()

// -------------------------
// this is a demo 
// -------------------------
module.exports = async (ctx, next) => {

    let _parrArr = ctx.url.toLowerCase().replace('/frontendbuild?', '').split('&')

    let _projectName = _parrArr[0]

    let _buildEnv = _parrArr[1]

    let buildEnv = _buildEnv == 'test' ? 'builddev' : 'buildlocal'

    let config = QBFK.config.dir
    
    let pubCat = path.join(config.publish, `./${_projectName}/${config.biz[_projectName].sub}`)
    
    if (pubCat && fs.existsSync(pubCat)) {

        shell.cd(pubCat)

        try {

            shell.exec(`git pull && npm i && npm run ${buildEnv}`)
            shell.exec(`zip -r ${_projectName}.zip dist`)
            shell.exec(`curl --form res=@${_projectName}.zip https://catch.tuhu.cn/profile/res --form "username=caozhongping@tuhu.cn" --form "password=TuhuMm_20101010"`)

            ctx.body = ctx.render('init', {
                title: '编译成功 | 初始化',
                result: '编译成功!'
            })

            mail({
                env: _buildEnv,
                project: _projectName,
                attachName: `${_projectName}.zip`,
                attachUrl: `${pubCat}/${_projectName}.zip`
            }, function () {
                shell.exec(`rm -rf ${_projectName}.zip`)
            })

        }
        catch (e) {
            console.log(`exec error ! please check ${config.biz[_projectName].git}`)
            ctx.body = ctx.render('init', {
                title: '编译成功 | 初始化',
                result: `编译失败：${e}`
            })
        }
    }
    else {
        
        shell.cd(config.publish)

        try {
            let bizCat =  path.join(config.publish, `./${_projectName}`)
            shell.exec(`git clone ${config.biz[_projectName].git} ${bizCat} `)
            shell.cd(`${pubCat}`)
            shell.exec(`npm i &&  npm i  postcss-less postcss-safe-parser postcss-sass postcss-scss --save && npm run ${buildEnv}`)
            shell.exec(`zip -r ${_projectName}.zip dist`)
            shell.exec(`curl --form res=@${_projectName}.zip https://catch.tuhu.cn/profile/res --form "username=caozhongping@tuhu.cn" --form "password=TuhuMm_20101010"`)
            
            ctx.body = ctx.render('init', {
                title: '编译成功 | 初始化',
                result: '编译成功!'
            })

            mail({
                env: _buildEnv,
                project: _projectName,
                attachName: `${_projectName}.zip`,
                attachUrl: `${pubCat}/${_projectName}.zip`
            }, function () {
                shell.exec(`rm -rf ${_projectName}.zip`)
            })
        }
        catch (e) {
            console.log(`config error ! please check ${config.biz[_projectName].git}`)
            ctx.body = ctx.render('init', {
                title: '编译成功 | 初始化',
                result: `编译失败：${e}`
            })
        }
    }

}