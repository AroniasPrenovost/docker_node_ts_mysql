"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
/**
 * Import routes
 */
const users_router_1 = require("./models/users/users.router");
const registrations_router_1 = require("./models/registrations/registrations.router");
/**
 * Creates and configures an ExpressJS web server
 */
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints.
    routes() {
        // This function will change when we start to add more API endpoints 
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/users', users_router_1.UsersRouter);
        this.express.use('/api/v1/registrations', registrations_router_1.RegistrationsRouter);
    }
}
exports.default = new App().express;
