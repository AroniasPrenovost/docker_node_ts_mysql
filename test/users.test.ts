import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/users', () => {

  it('responds with JSON array', () => {
    return chai.request(app).get('/api/v1/users')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        // expect(res.body).to.have.length(5);
      });
  });

  it('should include aronprenovostmktg@gmail.com', () => {
    return chai.request(app).get('/api/v1/users')
      .then(res => {
        let emailAddress = res.body.find(user => user.email_address === 'aronprenovostmktg@gmail.com');
        expect(emailAddress).to.exist;
        expect(emailAddress).to.have.all.keys([
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

  describe('GET api/v1/users/:id', () => {

    it('responds with single JSON object', () => {
      return chai.request(app).get('/api/v1/users/1')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should return aronprenovostmktg@gmail.com', () => {
      return chai.request(app).get('/api/v1/users/1')
        .then(res => {
          expect(res.body.user.email_address).to.equal('aronprenovostmktg@gmail.com');
        });
    });

  });

});
