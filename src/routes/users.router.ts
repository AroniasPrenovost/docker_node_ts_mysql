/**
 * Required External Modules and Interfaces
 */

import { Request, Response } from 'express';
import * as express from 'express';
import * as UsersService from '../models/users/users.service';
import { User } from '../models/users/user.interface';
import { UserLogin } from '../models/users/userLogin.interface';
import { HttpResponse } from '../models/httpResponses/httpResponse.interface';
import { authCheck } from '../middlewares/authCheck';

/**
 * Router Definition
 */

export const UsersRouter = express.Router();

/**
 * Controller Definitions
 */

// GET users/
UsersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const httpResponse: HttpResponse = await UsersService.getAll();
    let data: Object = JSON.parse(JSON.stringify(httpResponse.data));

    res.status(httpResponse.status_code)
    .send({
      message: httpResponse.message,
      status: res.status,
      data
    });

  } catch (e) {
    res.status(404).send(e.message);
  }
});
  
// GET users/id/:id
UsersRouter.get('/id/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const httpResponse: HttpResponse = await UsersService.findById(id);
    let data = JSON.parse(JSON.stringify(httpResponse.data));

    res.status(httpResponse.status_code)
    .send({
      message: httpResponse.message,
      status: res.status,
      data
    });

  } catch (e) {
    res.status(404).send(e.message);
  }
});

// GET users/:email
UsersRouter.get('/email/:email', async (req: Request, res: Response) => {
  try {
    const email: string = req.params.email;
    const httpResponse: HttpResponse = await UsersService.findByEmail(email);
    let data = JSON.parse(JSON.stringify(httpResponse.data));

    res.status(httpResponse.status_code)
    .send({
      message: httpResponse.message,
      status: res.status,
      data
    });

  } catch (e) {
    res.status(404).send(e.message);
  }
});
  
// POST users/
UsersRouter.post('/', authCheck, async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const httpResponse: HttpResponse = await UsersService.create(user);
    let data: Object = JSON.parse(JSON.stringify(httpResponse.data));
    
    res.status(httpResponse.status_code)
    .send({
      message: httpResponse.message,
      status: res.status,
      data
    });

  } catch (e) {
    res.status(404).send(e.message);
  }   
});

// POST users/login
UsersRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const userLogin: UserLogin = req.body;
    const httpResponse: HttpResponse = await UsersService.login(userLogin);  
    let data: Object = JSON.parse(JSON.stringify(httpResponse.data));
    
    res.status(httpResponse.status_code)
    .send({
      message: httpResponse.message,
      status: res.status,
      data
    });

  } catch (e) {
    res.status(404).send(e.message);
  }   
});

// PUT users/
UsersRouter.put('/', authCheck, async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const httpResponse: HttpResponse = await UsersService.update(user);
    let data: Object = JSON.parse(JSON.stringify(httpResponse.data));

    res.status(httpResponse.status_code)
    .send({
      message: httpResponse.message,
      status: res.status,
      data
    });

  } catch (e) {
    res.status(500).send(e.message);
  }
});
  
// DELETE users/
UsersRouter.delete('/:id', authCheck, async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await UsersService.remove(id);

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
