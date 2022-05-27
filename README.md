# Dockerized RESTful API

The `/client` and `/server` project components can be installed and ran independently, but the purpose of this repository is to demonstrate how to run a full-stack application using Docker.

### Project Components

* `/` 
	* `docker-compose.yml` file to orchestrate containers
* `/client`
	* ReactJS frontend
	* `ngnix.conf` file
	* `Dockerfile` to build frontend image
* `/server`
	* Node  TypeScript API
	* MySQL database (no ORM)
	* Tests written in Jest
	* API documented in Swagger
	* `Dockerfile` to build backend image

### Project Setup

**1.** In the `/` folder, configure .env file and map Docker ports to db connection.
```sh
cp .env-sample .env
``` 

**2.** In the `/server` folder, configure .env file and map Docker ports to db connection.
```sh
cp .env-sample .env
``` 

**3.** follow the steps in `/server/README.md` to populate your local MYSQL database. This is the database Docker will clone and place inside the server container.

**4.** Build React, Node, and MySQL containers
```sh
docker-compose up
```
Or, run all services in the background
```sh
docker-compose up -d
```

### Up and running
Site URL: `localhost:{REACT_LOCAL_PORT}`
Swagger API: `{url}/api/v1/API_ENDPOINT`

### Shutting down
```sh
docker-compose down
```
Stop and remove all containers, networks, and images 
```sh
docker-compose down --rmi all
```

### Long-Term Goals 

Build a real world "production" REST API: 

* [ ] Scalable, must be able to run more than one instance.

* [x] Dockerized project into container

* [x] Unit tested, must be able to run "go test ./..." directly from clone.

* [x] Integration tested, recommend docker-compose.

* [x] OpenAPI/Swagger (or similar for gRPC) documented.

* [x] dep vendored, but using the standard library often, instead of piling on dependencies.

* [x] Authenticated and Authorized via apikeys and/or user accounts.

* [ ] Built and tested via CI: Travis, CircleCi, etc. Recommend Makefile for task documentation.

* [x] Flag & ENV config, API keys, ports, dev mode, etc.

* [x] Use of Context to limit request time.

* [ ] Leveled JSON logging, logrus or similar.

* [x] Postgres/MySQL, sqlx or an ORM.

* [ ] Redis/memcache for scalable caching.

* [ ] Datadog, New Relic, AppDynamics, etc for monitoring and statistics.

* [x] Well documented README.md with separate sections for API user and service developer audiences. Maybe even include graphviz or mermaidJS UML diagrams.

* [x] Clean git history with structured commits and useful messages. No merge master commits.

* [ ] Passing go fmt, go lint, or better, go-metalinter in the CI.