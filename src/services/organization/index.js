'use strict';

const OrganizationRepository = require('../../repositories/organization');

const AppError = require('../../errors/error');
const ErrCodes = require('../../errors/codes');

const assert = require('assert-plus');


class OrganizationService {
    constructor(mongoConnection) {
        this.repository = {
            organization: new OrganizationRepository(mongoConnection)
        }
    }

    async addComment(newComment) {
        assert.object(newComment);
        assert.string(newComment.organization_name);
        assert.string(newComment.comment);

        try {
            let organization = await this.repository.organization.findOrganization({ name: newComment.organization_name });
            if (!organization) {
                organization = await this.repository.organization.createOrganization({ name: newComment.organization_name });
            }
            return await this.repository.organization.addComment({
                organization_id: organization.id,
                comment: newComment.comment
            });
        } catch (error) {
            throw error;
        }
    }

    async findComments(organizationName) {
        assert.string(organizationName);

        try {
            const organization = await this.repository.organization.findOrganization({ name: organizationName });
            if (!organization) {
                throw new AppError(
                    ErrCodes.OrganizationError.ORGANIZATION_NOT_FOUND_ERROR,
                    'Organization not found!'
                )
            }

            const comments = await this.repository.organization.findComments({ 
                organization_id: organization.id,
                is_deleted: false
            })

            return {
                organization_name: organization.name,
                comments: comments
            }
        } catch (error) {
            throw error
        }
    }
    
    async deleteComments(organizationName) {
        assert.string(organizationName);

        try {
            const organization = await this.repository.organization.findOrganization({ name: organizationName });
            if (!organization) {
                throw new AppError(
                    ErrCodes.OrganizationError.ORGANIZATION_NOT_FOUND_ERROR,
                    'Organization not found!'
                );
            }

            const result = await this.repository.organization.deleteComments({ organization_id: organization.id });
            return result;
        } catch (error) {
            throw error
        }
    }
}

module.exports = OrganizationService;
