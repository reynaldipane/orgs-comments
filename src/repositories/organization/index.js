'use strict';

const AppError = require('../../errors/error');
const ErrCodes = require('../../errors/codes');
const ErrNumbers = require('../../errors/numbers');
const assert = require('assert-plus');
const _ = require('underscore');

class OrganizationRepository {
    constructor(mongoConnection) {
        this.models = {
            Comment: mongoConnection.model(
                'Comment',
                require('./models/comment')
            ),
            Organization: mongoConnection.model(
                'Organization',
                require('./models/organization')
            )
        }
    }

    async findOrganization(filter) {
        assert.object(filter);
        assert.string(filter.name);

        const findOrganizationPromise = this.models.Organization.findOne(filter);
        return await OrganizationRepository.resolveFindOrganization(findOrganizationPromise);
    }

    static async resolveFindOrganization(findOrganizationPromise) {
        assert.object(findOrganizationPromise);

        let organization;

        try {
            organization = await findOrganizationPromise;
        } catch (error) {
            throw new AppError(
                ErrCodes.OrganizationError.ORGANIZATION_COMMENT_MONGOOSE_ERROR,
                'Error finding organization'
            );
        }

        if (!_.isObject(organization)) {
            return null;
        }

        return organization.toJSON();
    }


    async createOrganization(organization) {
        assert.object(organization);
        assert.string(organization.name);

        const createOrganizationPromise = this.models.Organization.create(organization);
        return await OrganizationRepository.resolveCreateOrganization(createOrganizationPromise);
    }

    static async resolveCreateOrganization(createOrganizationPromise) {
        assert.object(createOrganizationPromise);

        let organization;

        try {
            organization = await createOrganizationPromise;
        } catch (error) {
            if (error && error.code == ErrNumbers.MONGOOSE_DUPLICATE_ERROR_NUMBER) {
                throw new AppError(
                    ErrCodes.OrganizationError.DUPLICATE_ORGANIZATION_ERROR,
                    'Duplicate organization'
                )
            }

            throw new AppError(
                ErrCodes.OrganizationError.ORGANIZATION_COMMENT_MONGOOSE_ERROR,
                'Error when creating new organization'
            )
        }

        return organization.toJSON();
    }

    async addComment(newComment) {
        assert.object(newComment);
        assert.string(newComment.organization_id);
        assert.string(newComment.comment);

        const addCommentPromise = this.models.Comment.create(newComment);
        return await OrganizationRepository.resolveAddComment(addCommentPromise);
    }

    static async resolveAddComment(addCommentPromise) {
        assert.object(addCommentPromise);

        let addedComment;

        try {
            addedComment = await addCommentPromise;
        } catch (error) {
            if (error && error.code == ErrNumbers.MONGOOSE_DUPLICATE_ERROR_NUMBER) {
                throw new AppError(
                    ErrCodes.OrganizationError.DUPLICATE_ORGANIZATION_COMMENT_ERROR,
                    'Duplicate comment on organization'
                )
            }

            throw new AppError(
                ErrCodes.OrganizationError.ORGANIZATION_COMMENT_MONGOOSE_ERROR,
                'Error when adding new comment'
            )
        }

        return addedComment.toJSON();
    }

    async findComments(filter) {
        assert.object(filter);
        assert.string(filter.organization_id);
        assert.optionalBool(filter.is_deleted);

        const findCommentsPromise = this.models.Comment.find(filter);
        return await OrganizationRepository.resolveFindComments(findCommentsPromise);
    }

    static async resolveFindComments(findCommentsPromise) {
        assert.object(findCommentsPromise);
        
        let comments;
         
        try {
            comments = await findCommentsPromise;
        } catch (error) {
            throw new AppError(
                ErrCodes.OrganizationError.ORGANIZATION_COMMENT_MONGOOSE_ERROR,
                'Error when finding comments'
            )
        }

        return comments.map(function(comment) {
            return comment.toJSON();
        });
    }

    async deleteComments(filter) {
        assert.object(filter);
        assert.string(filter.organization_id);

        const deleteCommentsPromise = this.models.Comment.updateMany(filter, { is_deleted: true })
        return await OrganizationRepository.resolveDeleteComments(deleteCommentsPromise);
    }

    static async resolveDeleteComments(deleteCommentsPromise) {
        assert.object(deleteCommentsPromise);

        let result;

        try {
            result = await deleteCommentsPromise;          
        } catch (error) {
            throw new AppError(
                ErrCodes.OrganizationError.ORGANIZATION_COMMENT_MONGOOSE_ERROR,
                'Error when deleting comments'
            )
        }

        if (!result.nModified > 0) {
            throw new AppError(
                ErrCodes.OrganizationError.NO_COMMENTS_TO_DELETE_ERROR,
                'No comments to delete'
            )
        }

        return result
    }
}

module.exports = OrganizationRepository;