// -------------------------
// public file source loading by es6
// -------------------------
import http from 'http'
import path from 'path'
import Koa from 'koa'
import Convert from 'koa-convert'
import Logger from 'koa-logger'
import Bodyparser from 'koa-bodyparser'
import Json from 'koa-json'
import Cors from 'koa2-cors'

// -------------------------
// private file source loading by es6
// -------------------------
import BasicMidd from 'lib/basic'
import ErrorMidd from 'lib/error'
import RedisMidd from 'lib/redis'
import MysqlMidd from 'lib/mysql'
import { config } from 'QBFK'
import koaArt from 'koa-artTemplate'


// -----------------------
// app init
// -----------------------
const app = new Koa()
const debugServer = require('debug')('app:server')
const bodyparser = Bodyparser()


app.use(koaArt(path.resolve(__dirname, '../public/')))

// -----------------------
// middlewares
// -----------------------

app.use(Convert(Bodyparser()))
app.use(Convert(Json()))
app.use(Convert(Logger()))
app.use(RedisMidd())
app.use(MysqlMidd())
app.use(Cors({
  origin: function (ctx) {
    var schema = '',
      schemaList = ctx.request.url.split('/');

    for (var i = 0; i < schemaList.length; i++) {
      if (schema != schemaList[i] && schemaList[i].length > 0) {
        schema = schemaList[i];
        break;
      }
    }
    
    if (schema.length) {
      var proList = JSON.parse(ctx.redis.proList);
      for (var j = 0; j < proList.length; j++) {
        if (schema == proList[j].projectKey) {
          return proList[j].authDomain
        }
      }
    }
    return false;
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

// -------------------------
// middlewares router
// -------------------------
app.use(async (ctx, next) => {
  // const router = await require('./routes')(ctx)
  // await require('./routes').routes()(ctx, next)
  await require('./routes')(ctx, next)
})

// -------------------------
// middlewares business
// -------------------------
app.use(BasicMidd())

// -------------------------
// middlewares error
// -------------------------
app.use(ErrorMidd())


const port = parseInt(config.server_port)
const server = http.createServer(app.callback())

server.listen(port)
server.on('listening', () => {
  debugServer('listening on port: %d', port)
})

module.exports = app