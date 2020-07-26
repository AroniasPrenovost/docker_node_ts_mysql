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
    
    let email: string = req.body.email_address; 

    // if no password is explicitly set, randomize one + add to req.body
    let pw: string = req.body.password; 
    if (pw == null) {
      pw = 'placeholder';
      req.body.password = pw; 
    }  
        
    // add created_at timestamp to req.body
    let timestamp: string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    req.body.created_at = timestamp;

    // build query 
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

    // check if email address (the user) already exists
    let qy: string = `SELECT * FROM users WHERE email_address='${email}'`;
    let rs: Object = await dbPool.query(qy);

    if (Object.keys(rs).length) {  
      res.status(403)
        .send({
          message: 'User already exists.',
          status: res.status
        });
    } else { // add new user to table 
      query = `${preQuery}(${queryKeys}) ${postQuery}`;    
      await dbPool.query(query);      
      res.status(201)
        .send({
          message: 'Successfully added new user',
          status: res.status,
          email
        });
    }
  }

  /**
   * PUT users
   * 
   */

   // to do... 

   public async putOne(req: Request, res: Response, next: NextFunction) {
    let query: string = ''; 
    let preQuery: string = 'UPDATE Employees SET ';
    let queryKeys: string[] = [];
    let postQuery: string = 'WHERE id=';

    //   insForm, err := db.Prepare("UPDATE Employees SET name=?, city=? WHERE id=?")
    
    let email: string = req.body.email_address; 

    console.log(req.body)
    console.log('____');

    // if no password is explicitly set, randomize one + add to req.body
    let pw: string = req.body.password; 
    if (pw == null) {
      pw = 'placeholder';
      req.body.password = pw; 
    }  
        
    // add created_at timestamp to req.body
    let timestamp: string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    req.body.created_at = timestamp;

    // build query 
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

    console.log(query);

    // check if email address (the user) already exists
    // let qy: string = `SELECT * FROM users WHERE email_address='${email}'`;
    // let rs: Object = await dbPool.query(qy);

    // if (Object.keys(rs).length) {  
    //   res.status(403)
    //     .send({
    //       message: 'User already exists.',
    //       status: res.status
    //     });
    // } else { // add new user to table 
    //   query = `${preQuery}(${queryKeys}) ${postQuery}`;    
    //   await dbPool.query(query);      
    //   res.status(201)
    //     .send({
    //       message: 'Successfully added new user',
    //       status: res.status,
    //       email
    //     });
    // }
  }

      // let timestamp: string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      // req.body.updated_at = timestamp;

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
          message: 'Successfully retrieved user by id',
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
    this.router.put('/', this.putOne); 
  }
}

// Create the UserRouter, and export its configured Express.Router
const userRoutes = new UserRouter();
userRoutes.init();

export default userRoutes.router;
