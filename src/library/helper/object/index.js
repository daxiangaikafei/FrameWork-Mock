'use strict'

/**
 * define the objectHelper property the empty value
 */
var objectHelper = Object.create(Object.prototype,{
    Null: {
        get          : function() { return null },
        configurable : false
    }
})

module.exports = objectHelper
