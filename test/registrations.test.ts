import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';
import { Registration } from '../src/models/registrations/registration.interface';
import { Registration_Meta } from '../src/models/registrations/registration_meta.interface';
import { RegistrationsRouter } from '../src/models/registrations/registrations.router';

var Utils = require('../src/utils/index'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/registrations', () => {

  it('responds with JSON object', () => {
    return chai.request(app).get('/api/v1/registrations')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Successfully retrieved registrations.');
      });
  });

  it('registration data should have all keys', () => {
    return chai.request(app).get('/api/v1/registrations')
      .then(res => {
        let RegistrationExample: Registration = res.body.data[0]; 
        expect(RegistrationExample).to.exist;
        expect(RegistrationExample).to.have.all.keys([
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
          expect(res.body.message).to.equal('Successfully retrieved registration by id.');
        });
    });

    it('registration data should have all keys', () => {
      return chai.request(app).get('/api/v1/registrations/1')
    .then(res => {
      let RegistrationExample: Registration = res.body.data;
      expect(RegistrationExample).to.exist;
      expect(RegistrationExample).to.have.all.keys([
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


    it('should return aronprenovostmktg@gmail.com', () => {
      return chai.request(app).get('/api/v1/registrations/1')
        .then(res => {
          expect(res.body.data.email_address).to.equal('aronprenovostmktg@gmail.com');
        });
    });
  });


  /**
   * POST
   */
  // describe('POST api/v1/registrations', () => {

  //   let timestamp = Utils.datetimeTimestamp(); 
  //   let testJSON = {
  //     'email_address': `chaitest-${timestamp.replace(/ +/g, '-')}@test.com`, 
  //     'first_name': 'test account', 
  //     'last_name': 'test account', 
  //     'password': 'test',
  //     'created_at': timestamp
  //     // 'id': generated by mysql 
  //   }; 

  //   it('responds with JSON object', () => {
  //     return chai.request(app).post('/api/v1/registrations')
  //     .send(testJSON)
  //       .then(res => {
  //         expect(res.status).to.equal(201);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.an('object');
  //         expect(res.body.message).to.equal('Successfully added new registration and corresponding 'users' table record.');
  //       });
  //   });
  // });

  /**
   * PUT
   */
  //  describe('PUT api/v1/registrations', () => {

  //   let timestamp = Utils.datetimeTimestamp(); 
  //   let testJSON = {
  //     'id': 1,
  //     'password': `password-${timestamp.replace(/ +/g, '-')}`,
  //     'updated_at': timestamp
  //   }; 

  //   it('responds with JSON object', () => {
  //     return chai.request(app).put('/api/v1/registrations')
  //     .send(testJSON)
  //       .then(res => {
  //         expect(res.status).to.equal(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.an('object');
  //         expect(res.body.message).to.equal('Successfully updated registration.');
  //       });
  //   });
  // });

  /**
   * DELETE
   */

    // to do... 
  });
});
