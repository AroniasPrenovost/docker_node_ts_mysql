import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

/**
 * Import routes
 */ 
import UsersRouter from './routes/UsersRouter';
import RegistrationsRouter from './routes/RegistrationsRouter';

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
  }

  // Configure API endpoints.
  private routes(): void {
    // This function will change when we start to add more API endpoints 
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });
    this.express.use('/', router);
    this.express.use('/api/v1/users', UsersRouter);
    this.express.use('/api/v1/registrations', RegistrationsRouter);
  }

}

export default new App().express;
