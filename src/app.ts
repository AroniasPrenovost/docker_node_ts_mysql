require('dotenv').config();

import express from 'express';
import logger from 'morgan';
import * as bodyParser from 'body-parser';

import { customRedisRateLimiter } from './middlewares/rateLimiter'; 

const swaggerUi = require('swagger-ui-express');
import swaggerDocument from './swagger.json';
if (process.env.NODE_ENV === 'development') {
  swaggerDocument.host = 'localhost:' + process.env.PORT
}
/**
 * Import routes
 */ 
import { UsersRouter } from './routes/users.router';
import { RegistrationsRouter } from './routes/registrations.router';
/**
 * Creates and configures an ExpressJS web server
 */
class App {
  // ref to Express instance
  public express: express.Application;
  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }
  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(customRedisRateLimiter);
  }
  // Configure API endpoints.
  private routes(): void {
    // This function will change when we start to add more API endpoints 
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!'
      });
    });
    this.express.use('/', router);
    this.express.use('/api/v1/users', UsersRouter);
    this.express.use('/api/v1/registrations', RegistrationsRouter);
    this.express.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}
export default new App().express;