import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/registrations', () => {

  it('responds with JSON array', () => {
    return chai.request(app).get('/api/v1/registrations')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        // expect(res.body).to.have.length(5);
      });
  });

  it('should include RegistrationState', () => {
    return chai.request(app).get('/api/v1/registrations')
      .then(res => {
        let RegistrationState = res.body.find(registration => registration.registration_state === 'confirmed');
        expect(RegistrationState).to.exist;
        expect(RegistrationState).to.have.all.keys([
          'id',
          'registration_state',
          'registration_meta',
          'user_id',
          'event_id',
          'created_at',
          'updated_at',
          'anonymized_at'
        ]);
      });
  });

  describe('GET api/v1/registrations/:id', () => {

    it('responds with single JSON object', () => {
      return chai.request(app).get('/api/v1/registrations/1')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });

    it('should return confirmed', () => {
      return chai.request(app).get('/api/v1/registrations/1')
        .then(res => {
          expect(res.body.registration.registration_state).to.equal('confirmed');
        });
    });

  });

});
