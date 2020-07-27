import {Router, Request, Response, NextFunction} from 'express';
// import { Users } from '../models/Users';
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

    if (Object.keys(users).length) {  
      res.status(200)
        .send({
          message: 'Successfully retrieved users.',
          status: res.status,
          users
        });
    }
    else {
      res.status(204)
        .send({
          message: 'No user found.',
          status: res.status
        });
    }
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
          message: 'Successfully added new user.',
          status: res.status,
          email
        });
    }
  }

  /**
   * PUT users
   * 
   */

   public async putOne(req: Request, res: Response, next: NextFunction) {

    let user_id: number = req.body.id; 
    if (user_id == null) {
      res.status(403)
        .send({
          message: 'Missing id field.',
          status: res.status
        });
    }  

    // check if valid user id 
    let qy: string = `SELECT * FROM users WHERE id='${user_id}'`;
    let rs: Object = await dbPool.query(qy);
    if (!Object.keys(rs).length) {  
      res.status(403)
        .send({
          message: 'User with this id does not exist.',
          status: res.status
        });
    }

    // add updated_at timestamp to req.body
    let timestamp: string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    req.body.updated_at = timestamp;

    // build query 
    let query: string = ''; 
    let preQuery: string = 'UPDATE users SET';
    let queryKeys: string[] = [];
    let postQuery: string = `WHERE id=${user_id}`;

    Object.keys(req.body).forEach(function(key) {
      queryKeys.push(`${key}='${req.body[key]}'`); 
    });

    query = `${preQuery} ${queryKeys} ${postQuery}`; 
    await dbPool.query(query);      
    res.status(200)
      .send({
        message: 'Successfully updated user.',
        status: res.status,
        user_id
      });
  }

  /**
   * GET one user by id
   */
  public async getOne(req: Request, res: Response, next: NextFunction) {
    let query: string = 'SELECT * FROM users WHERE id=' + parseInt(req.params.id);
    let rows: Object = await dbPool.query(query);
    let user: Object = JSON.parse(JSON.stringify(rows))[0]; 

    if (user) {
      res.status(200)
        .send({
          message: 'Successfully retrieved user by id.',
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
   * DELETE users
   */

  public async deleteAll(req: Request, res: Response, next: NextFunction) {

    let qy: string = `SELECT * FROM users`;
    let rs: Object = await dbPool.query(qy);
    if (!Object.keys(rs).length) {  
      res.status(204)
        .send({
          message: 'There are no users to delete.',
          status: res.status
        });
    } else {
      let query = `DELETE FROM users`; 
      await dbPool.query(query);      
      res.status(200)
        .send({
          message: 'Successfully deleted users.',
          status: res.status,
          rs
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
    this.router.delete('/', this.deleteAll); 
  }
}

// Create the UserRouter, and export its configured Express.Router
const userRoutes = new UserRouter();
userRoutes.init();

export default userRoutes.router;
