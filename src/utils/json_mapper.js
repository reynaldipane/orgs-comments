'use strict';

module.exports = function (doc, ret) {
    ret.id = ret._id.toString();
    
    delete ret._id;
    delete ret.__v;
    delete ret.password;

    return ret;
};