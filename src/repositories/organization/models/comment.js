'use strict';

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        organization_id: { type: String, required: true },
        comment: { type: String, required: true },
        is_deleted: { type: Boolean, default: false }
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated'
        },
        toJSON: { transform: require('../../../utils/json_mapper') }
    }
);

module.exports = CommentSchema;
