import {Router, Request, Response, NextFunction} from 'express';
var dbPool = require('../Database');
// const TestRegistrations = require('../../test/data/registrationsData'); // static data disabled 

export class RegistrationsRouter {
  router: Router

  /**
   * Initialize the RegistrationsRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all registrations
   */
  public async getAll(req: Request, res: Response, next: NextFunction) {
    let query: string = 'SELECT * FROM registrations';
    let rows: Object = await dbPool.query(query);
    let registrations: Object = JSON.parse(JSON.stringify(rows)); 
    // res.send(TestRegistrations); // static data disabled 
    res.send(registrations);
  }

  /**
   * GET registration by id 
   */
  public async getOne(req: Request, res: Response, next: NextFunction) {    
    let query: string = 'SELECT * FROM registrations WHERE id=' + parseInt(req.params.id);
    let rows: Object = await dbPool.query(query);
    let registration: Object = JSON.parse(JSON.stringify(rows))[0]; 
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
  }

  /**
   * Attach each handler to an Express.Router's endpoints
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
  }
}

// Create the RegistrationsRouter, and export its configured Express.Router
const registrationsRoutes = new RegistrationsRouter();
registrationsRoutes.init();

export default registrationsRoutes.router;
