const request = require('supertest');
const expect = require('expect.js');
const app = require('../../../src/app');

const TIME_OUT = 60000;

describe('OrganizationController E2E test', function () {
    this.timeout(TIME_OUT);

    describe('POST /orgs/:organization_name/comments', function () {
        it('should response with new comment', (done) => {
            request(app)
                .post('/orgs/testOrgz/comments')
                .send({
                    comment: "Test comment!"
                })
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.comment).to.eql('Test comment!');
                    done()
                });
        });
    });
    
    describe('GET /orgs/:organization_name/comments', function () {
        it('should return comments of an organization', (done) => {
            request(app)
                .get('/orgs/testOrgz/comments')
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.comments).to.be.an('array');
                    expect(res.body.organization_name).to.eql('testOrgz');
                    done()
                });
        });
    
        it('should return organization not found error when finding comments', (done) => {
            request(app)
                .get('/orgs/testNotFound/comments')
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.status).to.eql(404)
                    expect(res.body.code).to.eql('ORGANIZATION_NOT_FOUND_ERROR');
                    done()
                });
        });
    });
    
    describe('DELETE /orgs/:organization_name/comments', function () {
        it('should delete organization comments', (done) => {
            request(app)
                .delete('/orgs/testOrgz/comments')
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.status).to.eql(200)
                    expect(res.body.success).to.eql(true);
                    done()
                });
        });
    
        it('should return organization not found error when deleting comments', (done) => {
            request(app)
                .delete('/orgs/testNotFound/comments')
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.status).to.eql(404)
                    expect(res.body.code).to.eql('ORGANIZATION_NOT_FOUND_ERROR');
                    done()
                });
        });
    });
});
