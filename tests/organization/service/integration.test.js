const sinon = require('sinon');
const expect = require('expect.js');

const OrganizationService = require('../../../src/services/organization');

describe('OrganizationService integration test', () => {
    let organizationService;

    before(() => {
        organizationService = new OrganizationService({ model: function () {} });
    });

    describe('addComment test', () => {
        it('should add new comment', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            const organizationData = {
                id: 'test-organization-id',
                name: 'test-organization-name'
            }

            const addCommentStub = sinon.stub(organizationService.repository.organization, 'addComment');
            const commentData = {
                id: 'test-comment-id',
                organization_id: 'test-organization-id',
                comment: 'test-comment'
            };

            findOrganizationStub.resolves(organizationData);
            addCommentStub.resolves(commentData);

            const result = await organizationService.addComment({
                organization_name: 'test-organization-name',
                comment: 'test-comment'
            });

            expect(result.id).to.eql(commentData.id);
            expect(result.organization_id).to.eql(commentData.organization_id);

            findOrganizationStub.restore();
            addCommentStub.restore();
        });

        it('should create organization if not exist', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            const createOrganizationStub = sinon.stub(organizationService.repository.organization, 'createOrganization');
            const addCommentStub = sinon.stub(organizationService.repository.organization, 'addComment');
            const commentData = {
                id: 'test-comment-id',
                organization_id: 'test-organization-id',
                comment: 'test-comment'
            };


            findOrganizationStub.resolves(null);
            createOrganizationStub.resolves({
                id: 'test-organization-id',
                name: 'test-organization-name'
            });
            addCommentStub.resolves(commentData);

            await organizationService.addComment({
                organization_name: 'test-organization-name',
                comment: 'test-comment'
            });

            expect(createOrganizationStub.callCount).to.eql(1);

            findOrganizationStub.restore();
            createOrganizationStub.restore();
            addCommentStub.restore();
        });

        it('should throws error', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            findOrganizationStub.throws({ error_code: 'test_error' });

            try {
                await organizationService.addComment({
                    organization_name: 'test-organization-name',
                    comment: 'test-comment'
                });
            } catch (error) {
                expect(error).to.be.an('object');
            }

            findOrganizationStub.restore();
        });
    });

    describe('findComments test', () => {
        it('should return comments', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            const organizationData = {
                id: 'test-organization-id',
                name: 'test-organization-name'
            }

            const findCommentsStub = sinon.stub(organizationService.repository.organization, 'findComments');
            const commentsData = [
                {
                    organization_id: 'test-organization-id',
                    comment: 'test-comment',
                }
            ]

            findOrganizationStub.resolves(organizationData);
            findCommentsStub.resolves(commentsData);

            const result = await organizationService.findComments('test-organization-name');
            expect(result.organization_name).to.eql('test-organization-name');
            expect(result.comments).to.be.an('array');

            findOrganizationStub.restore();
            findCommentsStub.restore();
        });

        it('should throws error', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            findOrganizationStub.throws({ error_code: 'test_error' });

            try {
                await organizationService.findComments('test-organization-name');
            } catch (error) {
                expect(error).to.be.an('object');
            }

            findOrganizationStub.restore();
        });

        it('should throws organization not found error', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            findOrganizationStub.resolves(null);

            try {
                await organizationService.findComments('test-organization-name');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('ORGANIZATION_NOT_FOUND_ERROR');
            }

            findOrganizationStub.restore();
        });
    });

    describe('deleteComments test', () => {
        it('should delete commets', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            const organizationData = {
                id: 'test-organization-id',
                name: 'test-organization-name'
            }

            const deleteCommentsStub = sinon.stub(organizationService.repository.organization, 'deleteComments');
            findOrganizationStub.resolves(organizationData);
            deleteCommentsStub.resolves({ nModified: 1 });

            const result = await organizationService.deleteComments('test-organization-name');
            expect(result.nModified).to.be.greaterThan(0);

            findOrganizationStub.restore();
            deleteCommentsStub.restore();
        });

        it('should throws error', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            findOrganizationStub.throws({ error_code: 'test_error' });

            try {
                await organizationService.deleteComments('test-organization-name');
            } catch (error) {
                expect(error).to.be.an('object');
            }

            findOrganizationStub.restore();
        });

        it('should throws organization not found error', async () => {
            const findOrganizationStub = sinon.stub(organizationService.repository.organization, 'findOrganization');
            findOrganizationStub.resolves(null);

            try {
                await organizationService.deleteComments('test-organization-name');
            } catch (error) {
                expect(error).to.be.an('object');
                expect(error.code).to.eql('ORGANIZATION_NOT_FOUND_ERROR');
            }

            findOrganizationStub.restore();
        });
    });
});