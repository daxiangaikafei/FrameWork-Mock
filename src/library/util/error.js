// -------------------------
// private file source loading by es6
// -------------------------
import ReturnObj   from 'model/return'
import path        from 'path'


// -------------------------
// error middleware
// -------------------------
module.exports = function(option){
    return async (ctx, next) => {
            try {

                if(ctx.status == 404){

                    obj  = new ReturnObj({
                            code : ctx.status
                    })

                    ctx.status = ctx.status
                    ctx.body = obj
                }
                else 
                await next()
                
            } catch (err) {
                if (err == null) {
                    err = new Error('System Error!');
                }
                // some errors will have .status
                var obj  = new ReturnObj({
                    code : err.status || 500,
                    message : err.stack
                })

                ctx.status = ctx.status
                ctx.body = obj
            }
    }
}
