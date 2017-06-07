import { stringHelper , objectHelper } from 'lib/helper'
import cst                             from 'model/dictionary'

// -------------------------
// default value setting
// -------------------------
var _message   = stringHelper.Empty
var _data      = objectHelper.Null
var _isSuccess = false
var _code      = cst.info.returnCode.default

module.exports = function(options){
    // console.log('_isSuccess',_isSuccess,'options',options)
    // -------------------------
    // default model  
    // -------------------------
    var ret =  {
        isSuccess  : _isSuccess ,
        code       : _code , 
        message    : _message ,
        data       : _data 
    }

    
// console.log('_isSuccess0',_isSuccess)

    /**
     * set code when condition
     */  
    Object.defineProperty(ret,'code', {
        get          : function(){
            return _isSuccess ? cst.info.returnCode.success : _code
        },
        set          : function(_newCode){
            _code = _newCode 
        },
        enumerable   : true,
        configurable : true
    })

    /**
     * set message when condition
     */
    Object.defineProperty(ret,'message', {
        get          : function(){
            return _code == 404 ? cst.error._404 + process.env.NODE_ENV : _message
        },
        set          : function(_newMessage){
            _message = _newMessage 
        },
        enumerable   : true,
        configurable : true
    })

    /**
     * set isSuccess when condition
     */   
    Object.defineProperty(ret,'isSuccess', {
        get          : function(){
            return _code == 404 ? false : _isSuccess
        },
        set          : function(_newIsSuccess){
            _isSuccess = _newIsSuccess 
        },
        enumerable   : true,
        configurable : true
    })

    /**
     * set data when condition
     */  
    Object.defineProperty(ret,'data', {
        get          : function(){
            return _code == 404 ? objectHelper.Null : _data
        },
        set          : function(_newData){
            _data = _newData 
        },
        enumerable   : true,
        configurable : true
    })

    return Object.assign(ret , options)
} 
