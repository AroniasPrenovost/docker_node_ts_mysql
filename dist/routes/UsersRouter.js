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
            query = `${preQuery}(${queryKeys}) ${postQuery}`;
            let rows = yield dbPool.query(query);
            console.log(rows);
            // to do: 
            // 1. complete return 
            // 2. write tests for endpoint 
            // let user: Object = JSON.parse(JSON.stringify(rows))[0]; 
            // let user: Object = TestUsers.find(user => user.id === query); // static data disabled 
            // if (user) {
            //   res.status(200)
            //     .send({
            //       message: 'Success',
            //       status: res.status,
            //       user
            //     });
            // }
            // else {
            //   res.status(404)
            //     .send({
            //       message: 'No user found with the given id.',
            //       status: res.status
            //     });
            // }
        });
    }
    /**
  * PUT users
  */
    // to do... 
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
                    message: 'Success',
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
