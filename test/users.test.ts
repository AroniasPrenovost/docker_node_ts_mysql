import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

/**
 * GET
 */
describe('GET api/v1/users', () => {

  it('responds with JSON array', () => {
    return chai.request(app).get('/api/v1/users')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Successfully retrieved users.');
      });
  });

  it('example user email should equal aronprenovostmktg@gmail.com', () => {
    return chai.request(app).get('/api/v1/users')
      .then(res => {
        let exampleUser = res.body.users[0];
        expect(exampleUser.email_address).to.equal('aronprenovostmktg@gmail.com'); 
        expect(exampleUser).to.exist;
        expect(exampleUser).to.have.all.keys([
          'id',
          'email_address',
          'password',
          'first_name',
          'last_name',
          'created_at',
          'updated_at',
          'anonymized_at'
        ]);
      });
  });

  /**
   * GET/:id
   */
  describe('GET api/v1/users/:id', () => {

    it('responds with single JSON object', () => {
      return chai.request(app).get('/api/v1/users/1')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Successfully retrieved user by id.');
        });
    });

    it('should return aronprenovostmktg@gmail.com', () => {
      return chai.request(app).get('/api/v1/users/1')
        .then(res => {
          expect(res.body.user.email_address).to.equal('aronprenovostmktg@gmail.com');
        });
    });
  });

  /**
   * POST
   */
  describe('POST api/v1/users', () => {

    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
    let testJSON = {
      'email_address': `chaitest-${timestamp.replace(/ +/g, '-')}@test.com`, 
      'first_name': 'test account', 
      'last_name': 'test account', 
      'password': 'test',
      'created_at': timestamp
      // 'id': generated by mysql 
    }; 

    it('responds with JSON array', () => {
      return chai.request(app).post('/api/v1/users')
      .send(testJSON)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Successfully added new user.');
        });
    });
  });

  /**
   * PUT
   */
   describe('PUT api/v1/users', () => {

    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
    let testJSON = {
      'id': 1,
      'password': `PUT-test-password-${timestamp.replace(/ +/g, '-')}`,
      'updated_at': timestamp
    }; 

    it('responds with JSON array', () => {
      return chai.request(app).put('/api/v1/users')
      .send(testJSON)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Successfully updated user.');
        });
    });
  });

  /**
   * DELETE
   */

    // to do... 
});
