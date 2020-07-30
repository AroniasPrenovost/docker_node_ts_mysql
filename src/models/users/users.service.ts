/**
 * Data Model Interfaces
 */

import e = require('express');

import { User } from './user.interface';
import { Users } from './users.interface';
import { Http_Response } from './../http_responses/http_response.interface';

var Utils = require('../../utils/index'); 

/**
 * In-Memory Store
 */

var dbPool = require('../../database/Database'); 

/**
 * Service Methods
 * Each method returns an 'Http_Response' object to {model}.router
 * 
 */

// GET users/

export const getAll = async (): Promise<Http_Response> => {

  let http_response: Http_Response = {
    status_code: null, 
    message: '',
    data: {}
  };

  let query: string = 'SELECT * FROM users';
  let rows: Object = await dbPool.query(query);
  let users: Users = JSON.parse(JSON.stringify(rows)); 

  if (Object.keys(users).length) {  
    http_response.status_code = 200;
    http_response.message = 'Successfully retrieved users.';
    http_response.data = users; 
    return http_response;  
  }

  http_response.status_code = 204; 
  http_response.message = 'No users found.';
  http_response.data = {}; 
  return http_response;  
};

// GET users/:id

export const find = async (id: number): Promise<Http_Response> => {

  let http_response: Http_Response = {
    status_code: null, 
    message: '',
    data: {}
  };

  let query: string = `SELECT * FROM users WHERE id=${id}`;
  let rows: Object = await dbPool.query(query);
  let user: User = JSON.parse(JSON.stringify(rows))[0]; 

  if (user == undefined) {
    http_response.status_code = 404;
    http_response.message = 'No user found with the given id.';
    http_response.data = {'id': id}; 
    return http_response;  
  }

  http_response.status_code = 200;
  http_response.message = 'Successfully retrieved user by id.';
  http_response.data = user;
  return http_response;   
};

// POST users/

export const create = async (newUser: User): Promise<Http_Response> => {

  let http_response: Http_Response = {
    status_code: null, 
    message: '',
    data: {}
  };

  let query: string = ''; 
  let preQuery: string = 'INSERT INTO users';
  let queryKeys: string[] = [];
  let postQuery: string = 'VALUES(';
  
  let email: string = newUser.email_address; 

  // generate temp password for newUser if not set 
  let pw: string = newUser.password; 
  if (pw == null) {
    pw = 'placeholder';
    newUser.password = pw; 
  }  
      
  // add created_at timestamp to newUser
  newUser.created_at = Utils.datetimeTimestamp();

  // build POST query 
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

  // if email does not already exist, add new user
  let qy: string = `SELECT * FROM users WHERE email_address='${email}'`;
  let rs: Object = await dbPool.query(qy);

  if (Object.keys(rs).length) {  
    http_response.status_code = 403;
    http_response.message = 'User already exists.';
    http_response.data = {'email': email}; 
    return http_response; 
  }
    
  // add new user to table 
  query = `${preQuery}(${queryKeys}) ${postQuery}`;    
  await dbPool.query(query);    

  http_response.status_code = 201;
  http_response.message = 'Successfully added new user.';
  http_response.data = {'email': email}; 
  return http_response; 
};

// PUT users/

export const update = async (updatedUser: User): Promise<Http_Response> => {
  
  let http_response: Http_Response = {
    status_code: null, 
    message: '',
    data: {}
  };
  
  let user_id: number = updatedUser.id; 
  if (user_id == null) {
    http_response.status_code = 400;
    http_response.message = 'Missing id field.';
    http_response.data = {}; 
    return http_response;
  }  

  // check if valid user id 
  let qy: string = `SELECT * FROM users WHERE id='${user_id}'`;
  let rs: Object = await dbPool.query(qy);

  if (!Object.keys(rs).length) {  
    http_response.status_code = 404;
    http_response.message = 'User with this id does not exist.';
    http_response.data = {'id': user_id};
    return http_response;
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

  http_response.status_code = 200;
  http_response.message = 'Successfully updated user.';
  http_response.data = updatedUser
  return http_response;
};

// DELETE users/

export const remove = async (id: number): Promise<Http_Response> => {

  let http_response: Http_Response = {
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