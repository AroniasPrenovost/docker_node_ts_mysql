/**
 * Data Model Interfaces
 */

import e = require('express');

// auth 
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');

import { User } from './user.interface';
import { UserLogin } from './userLogin.interface';
import { Users } from './users.interface';
import { HttpResponse } from './../httpResponses/httpResponse.interface';

var Utils = require('../../utils/index'); 

/**
 * In-Memory Store
 */

var dbPool = require('../../database/database'); 

/**
 * Service Methods
 * Each method returns an 'HttpResponse' object to {model}.router
 * 
 */

// GET users/
export const getAll = async (): Promise<HttpResponse> => {

  let httpResponse: HttpResponse = {
    status_code: null, 
    message: '',
    data: {}
  };

  let query: string = 'SELECT * FROM users';
  let rows: Object = await dbPool.query(query);
  let users: Users = JSON.parse(JSON.stringify(rows)); 

  if (Object.keys(users).length) {  
    httpResponse.status_code = 200;
    httpResponse.message = 'Successfully retrieved users.';
    httpResponse.data = users; 
    return httpResponse;  
  }

  httpResponse.status_code = 204; 
  httpResponse.message = 'No users found.';
  httpResponse.data = {}; 
  return httpResponse;  
};

// GET users/id/:id
export const findById = async (id: number): Promise<HttpResponse> => {

  let httpResponse: HttpResponse = {
    status_code: null, 
    message: '',
    data: {}
  };

  let query: string = `SELECT * FROM users WHERE id=${id}`;
  let rows: Object = await dbPool.query(query);
  let user: User = JSON.parse(JSON.stringify(rows))[0]; 

  if (user == undefined) {
    httpResponse.status_code = 404;
    httpResponse.message = 'No user found with the given id.';
    httpResponse.data = {'id': id}; 
    return httpResponse;  
  }

  httpResponse.status_code = 200;
  httpResponse.message = 'Successfully retrieved user by id.';
  httpResponse.data = user;
  return httpResponse;   
};

// GET users/email/:email
export const findByEmail = async (email: string): Promise<HttpResponse> => {

  let httpResponse: HttpResponse = {
    status_code: null, 
    message: '',
    data: {}
  };

  let query: string = `SELECT * FROM users WHERE email_address='${email}'`;
  let rows: Object = await dbPool.query(query);
  let user: User = JSON.parse(JSON.stringify(rows))[0]; 

  if (user == undefined) {
    httpResponse.status_code = 401;
    httpResponse.message = 'No user found with the given email.';
    httpResponse.data = {'email': email}; 
    return httpResponse;  
  }

  httpResponse.status_code = 200;
  httpResponse.message = 'Successfully retrieved user by email.';
  httpResponse.data = user;
  return httpResponse;   
};

// POST users/
export const create = async (newUser: User): Promise<HttpResponse> => {

  let httpResponse: HttpResponse = {
    status_code: null, 
    message: '',
    data: {}
  };
  
  // throw error if user email already exists 
  let email: string = newUser.email_address; 
  let qy: string = `SELECT * FROM users WHERE email_address='${email}'`;
  let rs: Object = await dbPool.query(qy);

  if (Object.keys(rs).length) {  
    httpResponse.status_code = 403;
    httpResponse.message = 'User already exists.';
    httpResponse.data = {'email': email}; 
    return httpResponse; 
  }

  // generate hashed password 
  await bcrypt.hash(newUser.account_password, 10).then(function(hash) {
    newUser.account_password = hash; 
  });

  // add created_at timestamp  
  newUser.created_at = Utils.datetimeTimestamp();

  // build POST query 
  let query: string = ''; 
  let preQuery: string = 'INSERT INTO users';
  let queryKeys: string[] = [];
  let postQuery: string = 'VALUES(';

  let x: number = 0; 
  Object.keys(newUser).forEach(function(key) {
    queryKeys.push(key); 
    postQuery = `${postQuery} '${newUser[key]}'`;
    if (x < ((Object.keys(newUser)).length - 1)) {
      postQuery = `${postQuery},`;
    } else {
      postQuery = `${postQuery})`;
    }
    x++; 
  });
    
  // add new user to table 
  query = `${preQuery}(${queryKeys}) ${postQuery}`;    
  await dbPool.query(query);    

  httpResponse.status_code = 201;
  httpResponse.message = 'Successfully added new user.';
  httpResponse.data = {'email': email}; 
  return httpResponse; 
};

// POST login user/
export const login = async (userLogin: UserLogin): Promise<HttpResponse> => {

  let httpResponse: HttpResponse = {
    status_code: null, 
    message: '',
    data: {}
  };

  let email: string = userLogin.email_address;
  let password: string = userLogin.account_password; 

  // check if email exists 
  const findByEmailResponse: HttpResponse = await findByEmail(email);

  if (findByEmailResponse.status_code === 200) {
    let hashedPassword: string = findByEmailResponse['data']['account_password'];
    const hash = await bcrypt.compare(password, hashedPassword); 

    if (hash) {
      const token = jwt.sign({
          email: email,
          id: findByEmailResponse['data']['id']
        }, 
        process.env.JWT_KEY, {
          expiresIn: '1h'
        }
      ); 

      httpResponse.status_code = 200;
      httpResponse.message = 'Authorization successful.';
      httpResponse.data = {
        'email': email,
        'token': token
      }; 
      return httpResponse;
    } else {
      httpResponse.status_code = 401;
      httpResponse.message = 'Authorization failed.';
      httpResponse.data = {'email': email}; 
      return httpResponse; 
    }
  } else {
    httpResponse.status_code = 401;
    httpResponse.message = 'Authorization failed.';
    httpResponse.data = {'email': email}; 
    return httpResponse; 
  }
};

// PUT users/
export const update = async (updatedUser: User): Promise<HttpResponse> => {
  
  let httpResponse: HttpResponse = {
    status_code: null, 
    message: '',
    data: {}
  };
  
  let user_id: number = updatedUser.id; 
  if (user_id == null) {
    httpResponse.status_code = 400;
    httpResponse.message = 'Missing id field.';
    httpResponse.data = {}; 
    return httpResponse;
  }  

  // check if valid user id 
  let qy: string = `SELECT * FROM users WHERE id='${user_id}'`;
  let rs: Object = await dbPool.query(qy);

  if (!Object.keys(rs).length) {  
    httpResponse.status_code = 404;
    httpResponse.message = 'User with this id does not exist.';
    httpResponse.data = {'id': user_id};
    return httpResponse;
  };

  // add updated_at timestamp to updatedUser
  updatedUser.updated_at = Utils.datetimeTimestamp();

  // build query 
  let query: string = ''; 
  let preQuery: string = 'UPDATE users SET';
  let queryKeys: string[] = [];
  let postQuery: string = `WHERE id=${user_id}`;

  Object.keys(updatedUser).forEach(function(key) {
    queryKeys.push(`${key}='${updatedUser[key]}'`); 
  });

  query = `${preQuery} ${queryKeys} ${postQuery}`; 
  await dbPool.query(query);      

  httpResponse.status_code = 200;
  httpResponse.message = 'Successfully updated user.';
  httpResponse.data = updatedUser
  return httpResponse;
};

// DELETE users/
export const remove = async (id: number): Promise<HttpResponse> => {

  let httpResponse: HttpResponse = {
    status_code: null, 
    message: '',
    data: {}
  };

  //  const record: User = users[id];

  let qy: string = `SELECT * FROM users`;
  let rs: Object = await dbPool.query(qy);
  if (!Object.keys(rs).length) {  
    // res.status(204)
    //   .send({
    //     message: 'There are no users to delete.',
    //     status: res.status
    //   });
  } else {
    let query = `DELETE FROM users`; 
    await dbPool.query(query);      
    // res.status(200)
    //   .send({
    //     message: 'Successfully deleted users.',
    //     status: res.status,
    //     rs
    //   });
  }

  throw new Error('No record found to delete');
};