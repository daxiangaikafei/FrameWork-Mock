var path        = require('path')
var _           = require('lodash')
var development = require('./env/development')
var test        = require('./env/test')
var production  = require('./env/production')

const config = {
    
    // ------------------------------
    // Project Struct
    // ------------------------------
    abs_dist  : path.resolve('dist'),
    abs_src   : path.resolve('src'),
    base_path : path.join(__dirname, '../'),
    dir_dist  : 'dist',
    dir_src   : 'src',
    dir_module: 'node_module',

    // ------------------------------
    // Project env
    // ------------------------------
    env : process.env.NODE_ENV || 'development',

    // ------------------------------
    // Server Configuration
    // ------------------------------ 
    server_host : process.env.NODE_ENV === 'development' ? '127.0.0.1' : '172.16.20.56',
    server_port : process.env.NODE_ENV === 'development' ? process.env.port || 8081 : 8081
}

// ------------------------------
// Redis Configuration
// ------------------------------ 
const redis_config = {
    development  : development,
    test         : test,
    production   : production
}

module.exports = _.merge(config,redis_config[config.env])
