"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const bodyParser = __importStar(require("body-parser"));
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swagger_json_1 = __importDefault(require("./swagger.json"));
if (process.env.NODE_ENV === 'development') {
    swagger_json_1.default.host = 'localhost:' + process.env.PORT;
}
/**
 * Import routes
 */
const users_router_1 = require("./routes/users.router");
const registrations_router_1 = require("./routes/registrations.router");
/**
 * Creates and configures an ExpressJS web server
 */
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express_1.default();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(morgan_1.default('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints.
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
