# RESTful API With Node and TypeScript

### Project Setup 

1. Fork/clone this repo
2. Create database tables (see below)
3. Configure .env files to match MySQL database connection, Docker ports: `cp .env-sample .env`
  - Do this in `/root` folder and in `/server`
4. Install dependencies - `npm install`
5. Compile - `npm run build`
6. Compile assets - `gulp assets`
7. Tests - `npx test`
8. Run the development server - `npm start`
9. Run Redis server in separate window - `redis-server` [*DISABLED]

Build & run locally 
```sh
npm run build ; gulp assets ; npx jest ; npm start
``` 

[*DISABLED]
```sh 
 redis-server
```

### Unit tests with Jest
```sh
npx jest 
```
or 
```sh
npm run test 
```

### SwaggerUI docs 
```
{url}/api/v1/docs/
```

### Data storage - MySQL

To build a local instance of the database, copy and run the following commands: 

## Create `your_db_name` Database

```sh
CREATE DATABASE test_data_table;
USE test_data_table;
```

## Create and populate `REGISTRATIONS` table

```sh
CREATE TABLE registrations (
  id int(11) NOT NULL AUTO_INCREMENT,				    	
  user_id int(11) NOT NULL,
  event_id int(11) NOT NULL,
  registration_state enum('standard','unverified','anonymized') COLLATE utf8mb4_unicode_ci DEFAULT 'unverified',
  registration_meta json DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NULL DEFAULT NULL,
  anonymized_at datetime NULL DEFAULT NULL,
  primary key (id)
);

-- insert test registrations 
INSERT INTO registrations (id, event_id, user_id, registration_state, registration_meta)
VALUES (1, 1, 1, 'standard', '{"first_name":"Test","last_name":"Doe","phone_number":"2065428765","email_address":"test@aol.com","contact_me":false}');

INSERT INTO registrations (id, event_id, user_id, registration_state, registration_meta)
VALUES (2, 1, 2, 'standard', '{"first_name":"John","last_name":"Doe","phone_number":"2065428765","email_address":"test@msn.com","contact_me":false}');

INSERT INTO registrations (id, event_id, user_id, registration_state, registration_meta)
VALUES (3, 3, 2, 'standard', '{"first_name":"John","last_name":"Doe","phone_number":"2065428765","email_address":"anon@gmail.com","contact_me":false}');
```

## Create and populate `USERS` table
Note: passwords being inserted are pre-hashed using Bcrypt https://www.browserling.com/tools/bcrypt. You must hash your own passwords for authentication tests to pass.

```sh
CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  email_address varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  account_password varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  first_name varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  last_name varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  role enum('ADMIN','USER','MODERATOR') COLLATE utf8mb4_unicode_ci DEFAULT 'MODERATOR',
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NULL DEFAULT NULL,
  anonymized_at datetime NULL DEFAULT NULL,
  primary key (id)
);

INSERT INTO users (id, email_address, account_password, first_name, last_name, USER)
VALUES (1, 'test@aol.com', '$2a$09$8W.y9OwZAdUBdhjQlEmlieBYLgwNorHBFtipxGUJV9ktPeGjU8fFG', 'John', 'Doe');

INSERT INTO users (id, email_address, account_password, first_name, MODERATOR)
VALUES (2, 'ap12@gmail.com', '$2a$12$/INFSHVfeUAMvLAddvu9cup0Judh/LHY0DySgCkpau.j1Cc/jike.', 'Alex', 'Doe');
```

## API endpoints

## registrations

`GET /registrations` returns list as JSON  
```sh
curl localhost:8080/api/v1/registrations
```

`GET /registrations/:id` returns registration by ID
```sh
curl localhost:8080/api/v1/registrations/1
```

`POST /registrations` adds new registration 
```sh
curl localhost:8080/api/v1/registrations -X POST -d '{"registration_state": "standard", "event_id": 12, "registration_meta": { "first_name": "Test", "last_name": "Testington", "phone_number": "123456789", "email_address": "testTestington@gmail.com", "contact_me": true}}' -H "Content-Type: application/json"
```

`PUT /registrations` update registration (requires ID or email address)
```sh
curl localhost:8080/api/v1/registrations -X PUT -d '{"id": 1, "registration_state": "standard"}' -H "Content-Type: application/json"
```

`DELETE /registrations` deletes all registrations
```sh
curl localhost:8080/api/v1/registrations -X DELETE
```

## users

`GET /users` returns list as JSON
```sh
curl localhost:8080/api/v1/users
```

`GET /users/id/:id` get user by Id 
```sh
curl localhost:8080/api/v1/users/id/1
```

`GET /users/email/:id` get user by email
```sh
curl localhost:8080/api/v1/users/email/test_email_address@gmail.com
```

`POST /users` adds new user record 
```sh
curl localhost:8080/api/v1/users -X POST -d '{"email_address": "fidelion@gmail.com", "first_name": "Test", "last_name": "Testington", "account_password": "$2a$09$0qpHBlv4RgzqIX6Os6jWJONiMdZaaogMqNLQ9M96EEP7A9Ybuqlbi"}' -H "Content-Type: application/json"
```

`POST /users/login` logs in user
```sh
curl localhost:8080/api/v1/users/login -X POST -d '{"email_address": "ap12@gmail.com", "account_password": "12345"}' -H "Content-Type: application/json"
```

`PUT /users` update user record - requires user's id
```sh
curl localhost:8080/api/v1/users -X PUT -d '{"email_address": "testTestington@gmail.com", "first_name": "Test", "last_name": "Johnson", "id": 1}' -H "Content-Type: application/json"
```
