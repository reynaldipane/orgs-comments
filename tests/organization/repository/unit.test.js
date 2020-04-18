const expect = require('expect.js');

const organizationRepository = require('../../../src/repositories/organization');

describe('OrganizationRepository Unit Test', () => {
    describe('resolveFindOrganization test', () => {
        it('should find organization based on the filter', async () => {
            const findOrganizationPromise = Promise.resolve({
                toJSON() {
                    return {
                        id: 'test-organization-id',
                        name: 'test-organization-name'
                    }
                }
            });

            const result = await organizationRepository.resolveFindOrganization(findOrganizationPromise);
            expect(result.id).to.eql('test-organization-id');
            expect(result.name).to.eql('test-organization-name');
        });

        it('should return null', async () => {
            const findOrganizationPromise = Promise.resolve(null);
            const result = await organizationRepository.resolveFindOrganization(findOrganizationPromise);
            expect(result).to.eql(null);
        });

        it('should throw mongoose error', async () => {
            try {
                const findOrganizationPromise = Promise.reject(null);
                await organizationRepository.resolveFindOrganization(findOrganizationPromise);
            } catch (error) {
                expect(error.code).to.eql('ORGANIZATION_COMMENT_MONGOOSE_ERROR')
            }
        });
    });

    describe('resolveCreateOrganization test', () => {
        it('should create new organization', async () => {
            const createOrganizationPromise = Promise.resolve({
                toJSON() {
                    return {
                        id: 'test-organization-id',
                        name: 'test-organization-name'
                    }
                }
            });

            const result = await organizationRepository.resolveCreateOrganization(createOrganizationPromise);
            expect(result.id).to.eql('test-organization-id');
            expect(result.name).to.eql('test-organization-name');
        });

        it('should throw mongoose error', async () => {
            try {
                const createOrganizationPromise = Promise.reject(null);
                await organizationRepository.resolveCreateOrganization(createOrganizationPromise);
            } catch (error) {
                expect(error.code).to.eql('ORGANIZATION_COMMENT_MONGOOSE_ERROR');
            }
        });

        it('should throw mongoose duplicate error', async () => {
            try {
                const createOrganizationPromise = Promise.reject({ code: 11000 });
                await organizationRepository.resolveCreateOrganization(createOrganizationPromise);
            } catch (error) {
                expect(error.code).to.eql('DUPLICATE_ORGANIZATION_ERROR');
            }
        });
    });

    describe('resolveAddComment test', () => {
        it('should add new comment', async () => {
            const addCommentPromise = Promise.resolve({
                toJSON() {
                    return {
                        id: 'test-comment-id',
                        organization_id: 'test-organization-id',
                        comment: 'test-comment'
                    }
                }
            });

            const result = await organizationRepository.resolveAddComment(addCommentPromise);
            expect(result.id).to.eql('test-comment-id');
            expect(result.organization_id).to.eql('test-organization-id');
            expect(result.comment).to.eql('test-comment');
        });

        it('should throw mongoose error', async () => {
            try {
                const addCommentPromise = Promise.reject(null);
                await organizationRepository.resolveAddComment(addCommentPromise);
            } catch (error) {
                expect(error.code).to.eql('ORGANIZATION_COMMENT_MONGOOSE_ERROR');
            }
        });

        it('should throw mongoose duplicate error', async () => {
            try {
                const addCommentPromise = Promise.reject({ code: 11000 });
                await organizationRepository.resolveAddComment(addCommentPromise);
            } catch (error) {
                expect(error.code).to.eql('DUPLICATE_ORGANIZATION_COMMENT_ERROR');
            }
        });
    });

    describe('resolveFindComments test', () => {
        it('should return comments', async () => {
            const findCommentsPromise = Promise.resolve([
                {
                    toJSON() {
                        return {
                            id: 'test-comment-id',
                            organization_id: 'test-organization-id',
                            comment: 'test-comment'
                        }
                    }
                }
            ]);
            const result = await organizationRepository.resolveFindComments(findCommentsPromise);
            expect(result).to.be.an('array');
        });

        it('should throw mongoose error', async () => {
            try {
                const findCommentsPromise = Promise.reject(null);
                await organizationRepository.resolveFindComments(findCommentsPromise);
            } catch (error) {
                expect(error.code).to.eql('ORGANIZATION_COMMENT_MONGOOSE_ERROR');
            }
        });
    });

    describe('resolveDeleteComments test', () => {
        it('should delete comments', async () => {
            const deleteCommentsPromise = Promise.resolve({
                nModified: 1
            });

            const result = await organizationRepository.resolveDeleteComments(deleteCommentsPromise);
            expect(result.nModified).to.be.greaterThan(0);
        });

        it('should throw no comments to delete error', async () => {
            try {
                const deleteCommentsPromise = Promise.resolve({
                    nModified: 0
                });
                await organizationRepository.resolveDeleteComments(deleteCommentsPromise);
            } catch (error) {
                expect(error.code).to.eql('NO_COMMENTS_TO_DELETE_ERROR');
            }
        });

        it('should throw mongoose error', async () => {
            try {
                const deleteCommentsPromise = Promise.reject(null);
                await organizationRepository.resolveDeleteComments(deleteCommentsPromise);
            } catch (error) {
                expect(error.code).to.eql('ORGANIZATION_COMMENT_MONGOOSE_ERROR');
            }
        });
    });
});