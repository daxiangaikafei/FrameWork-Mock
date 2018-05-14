
// -------------------------
// file alias
// -------------------------
import  'module-alias/register'


import QBFK      from 'QBFK'
import { merge } from 'lodash' 

module.exports = function(_config){

    // ------------------------------
    // setting basic config
    // ------------------------------
    merge(QBFK.config,_config)

    // ------------------------------
    // app starting
    // ------------------------------
    require('./app')

}