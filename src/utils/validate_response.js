'use strict';

const assert = require('assert-plus');
const Joi = require('joi');

module.exports = function (schema) {
    assert.object(schema);

    return function (req, res, next) {
        try {
            const validatedResponse = schema.validate(res.result, { stripUnknown: { objects: true } });
            res.status(200).json(validatedResponse.value);
        } catch(error) {
            return next(error);
        }
    };
};