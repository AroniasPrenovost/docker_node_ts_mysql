"use strict";
/**
 * Data Model Interfaces
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.login = exports.create = exports.findByEmail = exports.findById = exports.getAll = void 0;
// auth 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var Utils = require('../../utils/index');
/**
 * In-Memory Store
 */
var dbPool = require('../../database/database');
/**
 * Service Methods
 * Each method returns an 'HttpResponse' object to {model}.router
 *
 */
// GET users/
exports.getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    let httpResponse = {
        status_code: null,
        message: '',
        data: {}
    };
    let query = 'SELECT * FROM users';
    let rows = yield dbPool.query(query);
    let users = JSON.parse(JSON.stringify(rows));
    if (Object.keys(users).length) {
        httpResponse.status_code = 200;
        httpResponse.message = 'Successfully retrieved users.';
        httpResponse.data = users;
        return httpResponse;
    }
    httpResponse.status_code = 204;
    httpResponse.message = 'No users found.';
    httpResponse.data = {};
    return httpResponse;
});
// GET users/id/:id
exports.findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let httpResponse = {
        status_code: null,
        message: '',
        data: {}
    };
    let query = `SELECT * FROM users WHERE id=${id}`;
    let rows = yield dbPool.query(query);
    let user = JSON.parse(JSON.stringify(rows))[0];
    if (user == undefined) {
        httpResponse.status_code = 404;
        httpResponse.message = 'No user found with the given id.';
        httpResponse.data = { 'id': id };
        return httpResponse;
    }
    httpResponse.status_code = 200;
    httpResponse.message = 'Successfully retrieved user by id.';
    httpResponse.data = user;
    return httpResponse;
});
// GET users/email/:email
exports.findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let httpResponse = {
        status_code: null,
        message: '',
        data: {}
    };
    let query = `SELECT * FROM users WHERE email_address='${email}'`;
    let rows = yield dbPool.query(query);
    let user = JSON.parse(JSON.stringify(rows))[0];
    if (user == undefined) {
        httpResponse.status_code = 401;
        httpResponse.message = 'No user found with the given email.';
        httpResponse.data = { 'email': email };
        return httpResponse;
    }
    httpResponse.status_code = 200;
    httpResponse.message = 'Successfully retrieved user by email.';
    httpResponse.data = user;
    return httpResponse;
});
// POST users/
exports.create = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    let httpResponse = {
        status_code: null,
        message: '',
        data: {}
    };
    // throw error if user email already exists 
    let email = newUser.email_address;
    let qy = `SELECT * FROM users WHERE email_address='${email}'`;
    let rs = yield dbPool.query(qy);
    if (Object.keys(rs).length) {
        httpResponse.status_code = 403;
        httpResponse.message = 'User already exists.';
        httpResponse.data = { 'email': email };
        return httpResponse;
    }
    // generate hashed password 
    yield bcrypt.hash(newUser.account_password, 10).then(function (hash) {
        newUser.account_password = hash;
    });
    // add created_at timestamp  
    newUser.created_at = Utils.datetimeTimestamp();
    // build POST query 
    let query = '';
    let preQuery = 'INSERT INTO users';
    let queryKeys = [];
    let postQuery = 'VALUES(';
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
    // add new user to table 
    query = `${preQuery}(${queryKeys}) ${postQuery}`;
    yield dbPool.query(query);
    httpResponse.status_code = 201;
    httpResponse.message = 'Successfully added new user.';
    httpResponse.data = { 'email': email };
    return httpResponse;
});
// POST login user/
exports.login = (userLogin) => __awaiter(void 0, void 0, void 0, function* () {
    let httpResponse = {
        status_code: null,
        message: '',
        data: {}
    };
    let email = userLogin.email_address;
    let password = userLogin.account_password;
    // check if email exists 
    const findByEmailResponse = yield exports.findByEmail(email);
    if (findByEmailResponse.status_code === 200) {
        let hashedPassword = findByEmailResponse['data']['account_password'];
        const hash = yield bcrypt.compare(password, hashedPassword);
        if (hash) {
            const token = jwt.sign({
                email: email,
                id: findByEmailResponse['data']['id']
            }, process.env.JWT_KEY, {
                expiresIn: '1h'
            });
            httpResponse.status_code = 200;
            httpResponse.message = 'Authorization successful.';
            httpResponse.data = {
                'email': email,
                'token': token
            };
            return httpResponse;
        }
        else {
            httpResponse.status_code = 401;
            httpResponse.message = 'Authorization failed.';
            httpResponse.data = { 'email': email };
            return httpResponse;
        }
    }
    else {
        httpResponse.status_code = 401;
        httpResponse.message = 'Authorization failed.';
        httpResponse.data = { 'email': email };
        return httpResponse;
    }
});
// PUT users/
exports.update = (updatedUser) => __awaiter(void 0, void 0, void 0, function* () {
    let httpResponse = {
        status_code: null,
        message: '',
        data: {}
    };
    let user_id = updatedUser.id;
    if (user_id == null) {
        httpResponse.status_code = 400;
        httpResponse.message = 'Missing id field.';
        httpResponse.data = {};
        return httpResponse;
    }
    // check if valid user id 
    let qy = `SELECT * FROM users WHERE id='${user_id}'`;
    let rs = yield dbPool.query(qy);
    if (!Object.keys(rs).length) {
        httpResponse.status_code = 404;
        httpResponse.message = 'User with this id does not exist.';
        httpResponse.data = { 'id': user_id };
        return httpResponse;
    }
    ;
    // add updated_at timestamp to updatedUser
    updatedUser.updated_at = Utils.datetimeTimestamp();
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
    httpResponse.status_code = 200;
    httpResponse.message = 'Successfully updated user.';
    httpResponse.data = updatedUser;
    return httpResponse;
});
// DELETE users/
exports.remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let httpResponse = {
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
