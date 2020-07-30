"use strict";
/**
 * Data Model Interfaces
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * In-Memory Store
 */
var dbPool = require('../../database/Database');
/**
 * Service Methods
 * Each method returns an 'Http_Response' object to {model}.router
 *
 */
// GET users/
exports.getAll = () => __awaiter(this, void 0, void 0, function* () {
    let http_response = {
        status_code: null,
        message: '',
        data: {}
    };
    let query = 'SELECT * FROM users';
    let rows = yield dbPool.query(query);
    let users = JSON.parse(JSON.stringify(rows));
    if (Object.keys(users).length) {
        http_response.status_code = 200;
        http_response.message = 'Successfully retrieved users.';
        http_response.data = users;
        return http_response;
    }
    http_response.status_code = 204;
    http_response.message = 'No users found.';
    http_response.data = {};
    return http_response;
});
// GET users/:id
exports.find = (id) => __awaiter(this, void 0, void 0, function* () {
    let http_response = {
        status_code: null,
        message: '',
        data: {}
    };
    let query = `SELECT * FROM users WHERE id=${id}`;
    let rows = yield dbPool.query(query);
    let user = JSON.parse(JSON.stringify(rows))[0];
    if (user == undefined) {
        http_response.status_code = 404;
        http_response.message = 'No user found with the given id.';
        http_response.data = { 'id': id };
        return http_response;
    }
    http_response.status_code = 200;
    http_response.message = 'Successfully retrieved user by id.';
    http_response.data = user;
    return http_response;
});
// POST users/
exports.create = (newUser) => __awaiter(this, void 0, void 0, function* () {
    let http_response = {
        status_code: null,
        message: '',
        data: {}
    };
    let query = '';
    let preQuery = 'INSERT INTO users';
    let queryKeys = [];
    let postQuery = 'VALUES(';
    let email = newUser.email_address;
    // generate temp password for newUser if not set 
    let pw = newUser.password;
    if (pw == null) {
        pw = 'placeholder';
        newUser.password = pw;
    }
    // add created_at timestamp to newUser
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    newUser.created_at = timestamp;
    // build POST query 
    let x = 0;
    Object.keys(newUser).forEach(function (key) {
        queryKeys.push(key);
        postQuery = `${postQuery} '${newUser[key]}'`;
        if (x < ((Object.keys(newUser)).length - 1)) {
            postQuery = `${postQuery},`;
        }
        else {
            postQuery = `${postQuery})`;
        }
        x++;
    });
    // if email does not already exist, add new user
    let qy = `SELECT * FROM users WHERE email_address='${email}'`;
    let rs = yield dbPool.query(qy);
    if (Object.keys(rs).length) {
        http_response.status_code = 403;
        http_response.message = 'User already exists.';
        http_response.data = { 'email': email };
        return http_response;
    }
    // add new user to table 
    query = `${preQuery}(${queryKeys}) ${postQuery}`;
    yield dbPool.query(query);
    http_response.status_code = 201;
    http_response.message = 'Successfully added new user.';
    http_response.data = { 'email': email };
    return http_response;
});
// PUT users/
exports.update = (updatedUser) => __awaiter(this, void 0, void 0, function* () {
    let http_response = {
        status_code: null,
        message: '',
        data: {}
    };
    let user_id = updatedUser.id;
    if (user_id == null) {
        http_response.status_code = 400;
        http_response.message = 'Missing id field.';
        http_response.data = {};
        return http_response;
    }
    // check if valid user id 
    let qy = `SELECT * FROM users WHERE id='${user_id}'`;
    let rs = yield dbPool.query(qy);
    if (!Object.keys(rs).length) {
        http_response.status_code = 404;
        http_response.message = 'User with this id does not exist.';
        http_response.data = { 'id': user_id };
        return http_response;
    }
    ;
    // add updated_at timestamp to updatedUser
    let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    updatedUser.updated_at = timestamp;
    // build query 
    let query = '';
    let preQuery = 'UPDATE users SET';
    let queryKeys = [];
    let postQuery = `WHERE id=${user_id}`;
    Object.keys(updatedUser).forEach(function (key) {
        queryKeys.push(`${key}='${updatedUser[key]}'`);
    });
    query = `${preQuery} ${queryKeys} ${postQuery}`;
    yield dbPool.query(query);
    http_response.status_code = 200;
    http_response.message = 'Successfully updated user.';
    http_response.data = updatedUser;
    return http_response;
});
// DELETE users/
exports.remove = (id) => __awaiter(this, void 0, void 0, function* () {
    let http_response = {
        status_code: null,
        message: '',
        data: {}
    };
    //  const record: User = users[id];
    let qy = `SELECT * FROM users`;
    let rs = yield dbPool.query(qy);
    if (!Object.keys(rs).length) {
        // res.status(204)
        //   .send({
        //     message: 'There are no users to delete.',
        //     status: res.status
        //   });
    }
    else {
        let query = `DELETE FROM users`;
        yield dbPool.query(query);
        // res.status(200)
        //   .send({
        //     message: 'Successfully deleted users.',
        //     status: res.status,
        //     rs
        //   });
    }
    throw new Error('No record found to delete');
});
