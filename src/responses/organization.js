'use strict';

const Joi = require('joi');

const Comment = Joi.object().keys({
    id: Joi.string().required(),
    comment: Joi.string().required(),
    created: Joi.date().optional(),
    updated: Joi.date().optional(),
})

module.exports = {
    Comment: Comment,
    OrganizationComments: Joi.object().keys({
        organization_name: Joi.string().required(),
        comments: Joi.array().items(Comment).optional()
    }),
    DeleteComments: Joi.object().keys({
        success: Joi.bool().required()
    })
}