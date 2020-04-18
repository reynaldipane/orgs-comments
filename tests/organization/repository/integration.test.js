const Mongoose = require('mongoose').Mongoose;
const mongoose = new Mongoose();

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('expect.js');

const OrganizationRepository = require('../../../src/repositories/organization');

const TIME_OUT = 20000;

describe('OrganizationRepository Integration Test', function () {
    let organizationRepository, mongoConnection;

    this.timeout(TIME_OUT);

    before(async() => {
        await mockgoose.prepareStorage();
        mongoConnection = mongoose.createConnection('mongodb://example.com/TestingDB');
        organizationRepository = new OrganizationRepository(mongoConnection);
    });

    after(async() => {
        mockgoose.helper.reset();
    });

    describe('findOrganization test', () => {
        let existingOrganization;

        before(async() => {
            existingOrganization = await organizationRepository.createOrganization({ name: 'test-organization' })
        });

        it('should return existing organization data', async () => {
            const result = await organizationRepository.findOrganization({ name: 'test-organization' });
            expect(result.name).to.eql(existingOrganization.name);
        });
    });

    describe('createOrganization test', () => {
        it('should create new organization', async () => {
            const result = await organizationRepository.createOrganization({ name: 'test-orgs'});
            expect(result.name).to.eql('test-orgs');
        });
    });

    describe('addComment test', () => {
        it('should add new comment for organization', async () => {
            const result = await organizationRepository.addComment({
                organization_id: 'test-organization-id',
                comment: 'test-comment'
            })

            expect(result.organization_id).to.eql('test-organization-id');
            expect(result.comment).to.eql('test-comment');
        })
    });

    describe('findComment test', () => {
        before(async() => {
            await organizationRepository.addComment({
                organization_id: 'test-organization-id',
                comment: 'test-comment'
            })
        });

        it('should find comment based on organization id', async () => {
            const result = await organizationRepository.findComments({ organization_id: 'test-organization-id' });
            expect(result).to.be.an('array');
            expect(result.length).to.be.greaterThan(0);
        });
    });

    describe('deleteComments test', () => {
        let existingComment;

        before(async() => {
            existingComment = await organizationRepository.addComment({
                organization_id: 'test-organization-id',
                comment: 'test-comment'
            })
        });
        
        it('should soft deleted the existing comments by organization_id', async () => {
            const result = await organizationRepository.deleteComments({ organization_id: 'test-organization-id' });
            expect(result.nModified).to.be.greaterThan(0);
        });
    });
});
