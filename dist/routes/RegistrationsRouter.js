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
var dbPool = require('../database/Database');
// const TestRegistrations = require('../../test/data/registrationsData'); // static data disabled 
class RegistrationsRouter {
    /**
     * Initialize the RegistrationsRouter
     */
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * GET all registrations
     */
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = 'SELECT * FROM registrations';
            let rows = yield dbPool.query(query);
            let registrations = JSON.parse(JSON.stringify(rows));
            // res.send(TestRegistrations); // static data disabled 
            res.send(registrations);
        });
    }
    /**
     * GET registration by id
     */
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = 'SELECT * FROM registrations WHERE id=' + parseInt(req.params.id);
            let rows = yield dbPool.query(query);
            let registration = JSON.parse(JSON.stringify(rows))[0];
            // let registration: Object = TestRegistrations.find(registration => registration.id === query); // static data disabled 
            if (registration) {
                res.status(200)
                    .send({
                    message: 'Success',
                    status: res.status,
                    registration
                });
            }
            else {
                res.status(404)
                    .send({
                    message: 'No registration found with the given id.',
                    status: res.status
                });
            }
        });
    }
    /**
     * Attach each handler to an Express.Router's endpoints
     */
    init() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getOne);
    }
}
exports.RegistrationsRouter = RegistrationsRouter;
// Create the RegistrationsRouter, and export its configured Express.Router
const registrationsRoutes = new RegistrationsRouter();
registrationsRoutes.init();
exports.default = registrationsRoutes.router;
