"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const request = require('supertest');
var Utils = require('../utils/index');
/**
 * GET
 */
describe('GET api/v1/users', () => {
    test('responds with JSON object of users', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app_1.default).get('/api/v1/users');
        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('Successfully retrieved users.');
        expect(response.body instanceof Object).toBe(true);
        expect(response.body.data[0]).toMatchObject({
            id: expect.any(Number),
            email_address: expect.any(String),
            password: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
        });
        expect(Utils.validateEmailAddress(response.body.data[0].email_address)).toBe(true);
        done();
    }));
});
/**
 * GET/:id
 */
describe('GET api/v1/users/:id', () => {
    test('responds with single JSON user object', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app_1.default).get('/api/v1/users/1');
        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('Successfully retrieved user by id.');
        expect(response.body instanceof Object).toBe(true);
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            email_address: expect.any(String),
            password: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
        });
        expect(Utils.validateEmailAddress(response.body.data.email_address)).toBe(true);
        done();
    }));
});
/**
 * POST
 */
describe('POST api/v1/users', () => {
    let timestamp = Utils.datetimeTimestamp();
    let testJSON = {
        'email_address': `chaitest-${timestamp.replace(/ +/g, '-')}@testUsers.com`,
        'first_name': 'test account',
        'last_name': 'test account',
        'password': 'test',
        'created_at': timestamp
        // 'id': generated by mysql 
    };
    test('responds with single JSON object', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield request(app_1.default)
            .post('/api/v1/users')
            .send(testJSON)
            .expect(201)
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.status).toBe(201);
            expect(response.body instanceof Object).toBe(true);
            expect(response.body.message).toEqual('Successfully added new user.');
        }));
        done();
    }));
});
/**
 * PUT
 */
describe('PUT api/v1/users', () => {
    let timestamp = Utils.datetimeTimestamp();
    let testJSON = {
        'id': 1,
        'password': `password-${timestamp.replace(/ +/g, '-')}`,
        'updated_at': timestamp
    };
    test('responds with JSON object', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield request(app_1.default)
            .put('/api/v1/users')
            .send(testJSON)
            .expect(200)
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.status).toBe(200);
            expect(response.body instanceof Object).toBe(true);
            expect(response.body.message).toEqual('Successfully updated user.');
        }));
        done();
    }));
});
/**
 * DELETE
 */
// to do... 