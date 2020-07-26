"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
var dbPool = require('../Database');
// const TestUsers = require('../../test/data/usersData'); // static data disabled 
class UserRouter {
    /**
     * Initialize the UserRouter
     */
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * GET users
     */
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = 'SELECT * FROM users';
            let rows = yield dbPool.query(query);
            let users = JSON.parse(JSON.stringify(rows));
            // res.send(TestUsers); // static data disabled 
            res.send(users);
        });
    }
    /**
     * POST users
     */
    postOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = '';
            let preQuery = 'INSERT INTO users';
            let queryKeys = [];
            let postQuery = 'VALUES(';
            let email = req.body.email_address;
            // if no password is explicitly set, randomize one + add to req.body
            let pw = req.body.password;
            if (pw == null) {
                pw = 'placeholder';
                req.body.password = pw;
            }
            // add created_at timestamp to req.body
            let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            req.body.created_at = timestamp;
            // build query 
            let x = 0;
            Object.keys(req.body).forEach(function (key) {
                queryKeys.push(key);
                postQuery = `${postQuery} '${req.body[key]}'`;
                if (x < ((Object.keys(req.body)).length - 1)) {
                    postQuery = `${postQuery},`;
                }
                else {
                    postQuery = `${postQuery})`;
                }
                x++;
            });
            // check if email address (the user) already exists
            let qy = `SELECT * FROM users WHERE email_address='${email}'`;
            let rs = yield dbPool.query(qy);
            if (Object.keys(rs).length) {
                res.status(403)
                    .send({
                    message: 'User already exists.',
                    status: res.status
                });
            }
            else { // add new user to table 
                query = `${preQuery}(${queryKeys}) ${postQuery}`;
                yield dbPool.query(query);
                res.status(201)
                    .send({
                    message: 'Successfully added new user',
                    status: res.status,
                    email
                });
            }
            // to do: 
            // write tests for endpoint 
        });
    }
    /**
  * PUT users
  *
  */
    // to do... 
    // let timestamp: string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    // req.body.updated_at = timestamp;
    /**
  * DELETE users
  */
    // to do... 
    /**
     * GET one user by id
     */
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = 'SELECT * FROM users WHERE id=' + parseInt(req.params.id);
            let rows = yield dbPool.query(query);
            let user = JSON.parse(JSON.stringify(rows))[0];
            // let user: Object = TestUsers.find(user => user.id === query); // static data disabled 
            if (user) {
                res.status(200)
                    .send({
                    message: 'Successfully retrieved user by id',
                    status: res.status,
                    user
                });
            }
            else {
                res.status(404)
                    .send({
                    message: 'No user found with the given id.',
                    status: res.status
                });
            }
        });
    }
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getOne);
        this.router.post('/', this.postOne);
    }
}
exports.UserRouter = UserRouter;
// Create the UserRouter, and export its configured Express.Router
const userRoutes = new UserRouter();
userRoutes.init();
exports.default = userRoutes.router;
