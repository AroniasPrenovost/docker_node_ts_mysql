# RESTful API With Node and TypeScript

### Project Setup 

1. Fork/Clone
2. create .env w/ credentials - `cp .env-sample .env`
3. Install dependencies - `npm install`
4. Compile - `npm run build`
5. Compile assets - `gulp assets`
6. Tests - `npx test`
7. Run the development server - `npm start`

```sh
npm run build ; gulp assets ; npx jest ; npm start
```

### Run Redis server in separate window 
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

## Create DB

```sh
CREATE DATABASE test_data_table;
```

### Create `USERS` table

```sh
CREATE TABLE users (
  id int(11) NOT NULL,
  email_address varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  account_password varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  first_name varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  last_name varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  anonymized_at datetime NULL DEFAULT NULL
);

-- insert test users 
INSERT INTO users (id, email_address, account_password, first_name, last_name, created_at, updated_at, anonymized_at)
VALUES (1, 'test@aol.com', 'sdljfnf97976', 'John', 'Doe', '2020-08-20 00:14:14', '2020-09-01 19:15:57', NULL);

INSERT INTO users (id, email_address, account_password, first_name, last_name, created_at, updated_at, anonymized_at)
VALUES (2, 'test@msn.com', 'sdljfnf97976', 'John', 'Doe', '2018-08-20 00:14:14', '2019-09-01 19:15:57', NULL);
```

### Create REGISTRATIONS table

```sh
CREATE TABLE registrations (
  id int(11) NOT NULL,				    	
  user_id int(11) NOT NULL,
  event_id int(11) NOT NULL,
  registration_state enum('standard','unverified','anonymized') COLLATE utf8mb4_unicode_ci DEFAULT 'unverified',
  registration_meta json DEFAULT NULL,
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  anonymized_at datetime NULL DEFAULT NULL
);

-- insert test registrations 
INSERT INTO registrations (id, event_id, user_id, registration_state, registration_meta, created_at, updated_at, anonymized_at)
VALUES (1, 1, 1, 'standard', '{"first_name":"John","last_name":"Doe","phone_number":"2065428765","email_address":"test@aol.com","contact_me":false}', '2020-08-20 00:14:14', '2020-09-01 19:15:57', NULL);

INSERT INTO registrations (id, event_id, user_id, registration_state, registration_meta, created_at, updated_at, anonymized_at)
VALUES (2, 1, 2, 'standard', '{"first_name":"John","last_name":"Doe","phone_number":"2065428765","email_address":"test@msn.com","contact_me":false}', '2020-08-20 00:14:14', '2020-09-01 19:15:57', NULL);

INSERT INTO registrations (id, event_id, user_id, registration_state, registration_meta, created_at, updated_at, anonymized_at)
VALUES (3, 3, 2, 'standard', '{"first_name":"John","last_name":"Doe","phone_number":"2065428765","email_address":"anon@gmail.com","contact_me":false}', '2020-08-20 00:14:14', '2020-09-01 19:15:57', NULL);
```

## API endpoints

### registrations

`GET /registrations` returns list as JSON
```sh
curl localhost:8080/api/v1/registrations
```

`GET /registrations/:id` returns list as JSON
```sh
curl localhost:8080/api/v1/registrations
```

`POST /registrations` adds new registration 
```sh
curl localhost:8080/api/v1/registrations -X POST -d '{"registration_state": "unconfirmed", "event_id": 12, "registration_meta": { "first_name": "Test", "last_name": "Testington", "phone_number": "123456789", "email_address": "testTestington@gmail.com", "contact_me": true}}' -H "Content-Type: application/json"
```

`PUT /registrations` update registration (requires ID or email address)
```sh
curl localhost:8080/api/v1/registrations -X PUT -d '{}' -H "Content-Type: application/json"
```
```sh
curl localhost:8080/api/v1/registrations -X PUT -d '{"id": 7, "registration_state": "confirmed"}' -H "Content-Type: application/json"
```

`DELETE /registrations` deletes all registrations
```sh
curl localhost:8080/api/v1/registrations -X DELETE
```

### registration

`GET /registration` gets registration by id  
```sh
curl localhost:8080/api/v1/registration/{id}
```

### users

`GET /users` returns list as JSON
```sh
curl localhost:8080/api/v1/users
```

`GET /users/:id` get user by Id 
```sh
curl localhost:8080/api/v1/users
```

`POST /users` adds new user record 
```sh
curl localhost:8080/api/v1/users -X POST -d '{"email_address": "testTestingtongmail.com", "first_name": "Test", "last_name": "Testington", "password": "test"}' -H "Content-Type: application/json"
```

`PUT /users` update user record - requires user's id
```sh
curl localhost:8080/api/v1/users -X PUT -d '{"email_address": "testTestingtongmail.com", "first_name": "Test", "last_name": "Johnson", "id": 1}' -H "Content-Type: application/json"
```

## Long-Term Goals 
Build a real world "production" REST API: 

* [ ] Scalable, must be able to run more than one instance.

* [ ] Dockerized, runnable on minikube.

* [ ] Unit tested, must be able to run "go test ./..." directly from clone.

* [ ] Integration tested, recommend docker-compose.

* [x] OpenAPI/Swagger (or similar for gRPC) documented.

* [ ] dep vendored, but using the standard library often, instead of piling on dependencies.

* [ ] Authenticated and Authorized via apikeys and/or user accounts.

* [ ] Built and tested via CI: Travis, CircleCi, etc. Recommend Makefile for task documentation.

* [ ] Flag & ENV config, API keys, ports, dev mode, etc.

* [ ] "why" comments, not "what" or "how" which should be clear through func/variable names and godoc comments.

* [x] Use of Context to limit request time.

* [ ] Leveled JSON logging, logrus or similar.

* [x] Postgres/MySQL, sqlx or an ORM.

* [ ] Redis/memcache for scalable caching.

* [ ] Datadog, New Relic, AppDynamics, etc for monitoring and statistics.

* [ ] Well documented README.md with separate sections for API user and service developer audiences. Maybe even include graphviz or mermaidJS UML diagrams.

* [ ] Clean git history with structured commits and useful messages. No merge master commits.

* [ ] Passing go fmt, go lint, or better, go-metalinter in the CI.
