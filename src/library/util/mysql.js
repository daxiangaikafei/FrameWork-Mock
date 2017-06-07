// -------------------------
// public file source loading by es6
// -------------------------
import { config } from 'QBFK'
import mysql      from 'mysql'

// -------------------------
// init the mysql client
// -------------------------
var pool = mysql.createPool(config.mysql); 

// -------------------------
// mysql function prototype
// -------------------------
module.exports = function(options){

    // -------------------------
    // mysql function query
    // -------------------------
    var _query = function (sql ,option){
    return new Promise(function(resolve,reject){
            pool.getConnection(function(err,conn){  
                if(err){  
                    reject(err);  
                }else{  
                    conn.query(sql,option,function(err,results,fields){  
                        //释放连接  
                        conn.release();  
                        //事件驱动回调  
                        resolve(results);  
                    });  
                }  
            });  
        })
    }

    const query = 
    async function(sql,option){
      let data = await _query(sql,option)
      return data
    }

    // -------------------------
    // mysql function insert
    // -------------------------
    var _insert = function (table ,option){
    return new Promise(function(resolve,reject){
            pool.getConnection(function(err,conn){  
                if(err){  
                    reject(err);  
                }else{  
                    conn.query('INSERT INTO '+ table +' SET ?',option,function(err,results,fields){  
                        //释放连接  
                        conn.release();  

                        //事件驱动回调  
                        if(err)reject(err); 
                        else   resolve(results);  
                    });  
                }  
            });  
        })
    }

    const insert = 
    async function(sql,option){
      let data = await _insert(sql,option)
      return data
    }

    // -------------------------
    // mysql function update
    // -------------------------
    var _update = function (table ,option , where){
    return new Promise(function(resolve,reject){
            pool.getConnection(function(err,conn){  
                if(err){  
                    reject(err);  
                }else{  

                    var condition = [],
                        value = [],
                        whereCodn = [] ;
                    option && 
                    Object.keys(option).forEach(function(name) {
                        condition.push(name + ' = ?')
                        value.push(option[name])
                    });
                    where && 
                    Object.keys(where).forEach(function(name) {
                        whereCodn.push(name + ' = ?')
                        value.push(where[name])
                    });

                    conn.query('UPDATE '+ table +' SET ' + condition.join(',') + ' WHERE '+ whereCodn.join(','),value,function(err,results,fields){  
                        //释放连接  
                        conn.release();  

                        //事件驱动回调  
                        if(err)reject(err); 
                        else   resolve(results);  
                    });  
                }  
            });  
        })
    }

    const update = 
    async function(sql,option,where){
      let data = await _update(sql,option,where)
      return data
    }

    return async (ctx , next) => {
      ctx.mysql = {
          query,
          insert,
          update
      }
      await next()
    }
}
