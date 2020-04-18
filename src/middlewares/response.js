'use strict';

const { validationResult } = require('express-validator');

module.exports = function() {
    return function(err, req, res, next) {
        const requestValidationError = validationResult(req);
        
        if (!err) {
            return next(null);
        }

        if (!requestValidationError.isEmpty()) {
            return res.status(400).json({
                code: 'REQUEST_VALIDATION_ERROR',
                errors: requestValidationError.array()
            })
        }

        const errCodeMap = req.errorCodeMap || {};
        const statusCode = errCodeMap[err.code];

        if (typeof statusCode === 'number') {
            return res.status(statusCode).json({
                code: err.code,
                message: err.message
            })
        }

        res.status(500).json({
            code: 'UNKNOWN_ERROR',
            message: 'Server Error'
        })
    }
}