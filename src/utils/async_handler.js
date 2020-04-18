'use strict';

module.exports = function (handler) {
    return function (req, res, next) {
        const response = handler(req);

        response.then(function (response) {
            res.result = response;
            next(null);
        }).catch(function (err) {
            return next(err);
        });
    };
};
