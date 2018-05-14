'use strict'

/**
 * define the stringHelper property the empty value
 */
var stringHelper = Object.create(String.prototype,{
    Empty: {
        value    : '',
        writable : false
    }
})

module.exports = stringHelper