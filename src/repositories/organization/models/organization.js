'use strict';

const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated'
        },
        toJSON: { transform: require('../../../utils/json_mapper') }
    }
);

module.exports = OrganizationSchema;
