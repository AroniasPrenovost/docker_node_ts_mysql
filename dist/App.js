"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
/**
 * Import routes
 */
const UsersRouter_1 = require("./routes/UsersRouter");
const RegistrationsRouter_1 = require("./routes/RegistrationsRouter");
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
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/users', UsersRouter_1.default);
        this.express.use('/api/v1/registrations', RegistrationsRouter_1.default);
    }
}
exports.default = new App().express;
