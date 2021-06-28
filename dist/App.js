"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const bodyParser = __importStar(require("body-parser"));
const testMode = (process.env.JEST_WORKER_ID !== undefined) ? true : false;
const rateLimiter_1 = require("./middlewares/rateLimiter");
const swaggerUi = require('swagger-ui-express');
const swagger_json_1 = __importDefault(require("./swagger.json"));
swagger_json_1.default.host = `${process.env.NODE_ENV}:${process.env.PORT}`;
/**
 * Import routes
 */
const users_router_1 = require("./routes/users.router");
const registrations_router_1 = require("./routes/registrations.router");
/**
 * Create and configure ExpressJS web server
 */
class App {
    //Run configuration methods on the Express instance
    constructor() {
        this.express = express_1.default();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware
    middleware() {
        this.express.use(morgan_1.default('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        if (!testMode) {
            this.express.use(rateLimiter_1.customRedisRateLimiter);
        }
    }
    // Configure API endpoints
    routes() {
        // This function will change when we start to add more API endpoints 
        let router = express_1.default.Router();
        // placeholder route handler
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/users', users_router_1.UsersRouter);
        this.express.use('/api/v1/registrations', registrations_router_1.RegistrationsRouter);
        this.express.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swagger_json_1.default));
    }
}
exports.default = new App().express;
