'use strict';
const assert = require('assert-plus');

class AppError extends Error {
    constructor (code, message, context) {
        assert.optionalString(code);
        assert.optionalString(message);
        
        super(message);
        this.code =  code;
        this.message = message;
    }
}

module.exports = AppError;
