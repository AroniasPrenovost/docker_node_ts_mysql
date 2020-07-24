import {Router, Request, Response, NextFunction} from 'express';
var dbPool = require('../Database'); 
// const TestUsers = require('../../test/data/usersData'); // static data disabled 

export class UserRouter {
  router: Router

  /**
   * Initialize the UserRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET users
   */
  public async getAll(req: Request, res: Response, next: NextFunction) {
    let query: string = 'SELECT * FROM users';
    let rows: Object = await dbPool.query(query);
    let users: Object = JSON.parse(JSON.stringify(rows)); 
    // res.send(TestUsers); // static data disabled 
    res.send(users);
  }

  /**
   * POST users
   */

  public async postOne(req: Request, res: Response, next: NextFunction) {
    let query: string = ''; 
    let preQuery: string = 'INSERT INTO users';
    let queryKeys: string[] = [];
    let postQuery: string = 'VALUES(';

    let x: number = 0; 
    Object.keys(req.body).forEach(function(key) {
      queryKeys.push(key); 
      postQuery = `${postQuery} '${req.body[key]}'`;
      if (x < ((Object.keys(req.body)).length - 1)) {
        postQuery = `${postQuery},`;
      } else {
        postQuery = `${postQuery})`;
      }
      x++; 
    });


    query = `${preQuery}(${queryKeys}) ${postQuery}`;    
    let rows: Object = await dbPool.query(query);
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
  public async getOne(req: Request, res: Response, next: NextFunction) {
    let query: string = 'SELECT * FROM users WHERE id=' + parseInt(req.params.id);
    let rows: Object = await dbPool.query(query);
    let user: Object = JSON.parse(JSON.stringify(rows))[0]; 
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

// Create the UserRouter, and export its configured Express.Router
const userRoutes = new UserRouter();
userRoutes.init();

export default userRoutes.router;
