/**
 * Required External Modules and Interfaces
 */

import * as express from 'express';
import { Request, Response } from 'express';

import * as RegistrationsService from '../models/registrations/registrations.service';
import { Registration } from '../models/registrations/registration.interface';
import { HttpResponse } from '../models/httpResponses/httpResponse.interface';

/**
 * Router Definition
 */

export const RegistrationsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET registrations/
RegistrationsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const httpResponse: HttpResponse = await RegistrationsService.getAll();
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
  
// GET registrations/:id
RegistrationsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const httpResponse: HttpResponse = await RegistrationsService.find(id);
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

// POST registrations/
RegistrationsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const registration: Registration = req.body;
    const httpResponse: HttpResponse = await RegistrationsService.create(registration);
    let data: Object = JSON.parse(JSON.stringify(httpResponse.data));

    console.log(data);
    
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

// PUT registrations/
RegistrationsRouter.put('/', async (req: Request, res: Response) => {
  try {
    const registration: Registration = req.body;
    const httpResponse: HttpResponse = await RegistrationsService.update(registration);
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

// DELETE registrations/
RegistrationsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await RegistrationsService.remove(id);

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
