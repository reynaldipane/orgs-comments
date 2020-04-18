const OrganizationService = require('../services/organization');
const asyncHandler = require('../utils/async_handler');
const validateResponse = require('../utils/validate_response');

const registerError = require('../errors/register_error');
const ErrCodes = require('../errors/codes');

const { param, body} = require('express-validator/check')

const {
    Comment,
    OrganizationComments,
    DeleteComments
} = require('../responses/organization');

module.exports = function (app) {
    const organizationService = new OrganizationService(app.mongoConnection);

    app.post('/orgs/:organization_name/comments',
        [
            param('organization_name', 'organization_name can not be empty'),
            body('comment', 'comment can not be empty').exists(),
        ],
        registerError({
            [ErrCodes.OrganizationError.ORGANIZATION_NOT_FOUND_ERROR]: 404
        }),
        asyncHandler(async function(req) {
            const newComment = {
                organization_name: req.params.organization_name,
                comment: req.body.comment
            }

            const addedComment = await organizationService.addComment(newComment);
            return addedComment;
        }),
        validateResponse(Comment)
    );

    app.get('/orgs/:organization_name/comments',
        [
            param('organization_name', 'organization_name can not be empty')
        ],
        registerError({
            [ErrCodes.OrganizationError.ORGANIZATION_NOT_FOUND_ERROR]: 404
        }),
        asyncHandler(async function(req) {
            return await organizationService.findComments(req.params.organization_name);
        }),
        validateResponse(OrganizationComments)
    );

    app.delete('/orgs/:organization_name/comments',
        [
            param('organization_name', 'organization_name can not be empty')
        ],
        registerError({
            [ErrCodes.OrganizationError.ORGANIZATION_NOT_FOUND_ERROR]: 404
        }),
        asyncHandler(async function(req) {
            await organizationService.deleteComments(req.params.organization_name);
            return { success: true }
        }),
        validateResponse(DeleteComments)
    )
}