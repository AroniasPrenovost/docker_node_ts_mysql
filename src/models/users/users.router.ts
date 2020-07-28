/**
 * Required External Modules and Interfaces
 */

// import express, { Request, Response } from "express";
import {Router, Request, Response, NextFunction} from 'express';
import * as express from 'express';
import * as UsersService from "./users.service";
import { User } from "./user.interface";
import { Users } from "./users.interface";
import { Http_Response } from "./../http_responses/http_response.interface";
import { Console } from 'console';

/**
 * Router Definition
 */

export const UsersRouter = express.Router();

/**
 * Controller Definitions
 */

// GET users/

UsersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const http_response: Http_Response = await UsersService.getAll();
    let data: Object = JSON.parse(JSON.stringify(http_response.data));

    res.status(http_response.status_code)
    .send({
      message: http_response.message,
      status: res.status,
      data
    });

  } catch (e) {
    res.status(404).send(e.message);
  }
});
  
// GET users/:id

UsersRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const http_response: Http_Response = await UsersService.find(id);
    let data = JSON.parse(JSON.stringify(http_response.data));

    res.status(http_response.status_code)
    .send({
      message: http_response.message,
      status: res.status,
      data
    });

  } catch (e) {
    res.status(404).send(e.message);
  }
});
  
  // POST users/
  
  UsersRouter.post("/", async (req: Request, res: Response) => {
    try {
      const user: User = req.body;
      const http_response: Http_Response = await UsersService.create(user);
      let data: Object = JSON.parse(JSON.stringify(http_response.data));
      
      res.status(http_response.status_code)
      .send({
        message: http_response.message,
        status: res.status,
        data
      });

    } catch (e) {
      res.status(404).send(e.message);
    }   
  });
  
  // PUT users/

  UsersRouter.put("/", async (req: Request, res: Response) => {
    try {
      const user: User = req.body;
      const http_response: Http_Response = await UsersService.update(user);
      let data: Object = JSON.parse(JSON.stringify(http_response.data));

      res.status(http_response.status_code)
      .send({
        message: http_response.message,
        status: res.status,
        data
      });

    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  
  // DELETE users/
  
  UsersRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      await UsersService.remove(id);
  
      res.sendStatus(200);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  