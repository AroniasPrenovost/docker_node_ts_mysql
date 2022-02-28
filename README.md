# Dockerized RESTful API

This repo is an example of how to Dockerize a Nodejs Express and MySQL RESTful API w/ a ReactJS frontend using Docker Compose: https://www.bezkoder.com/docker-compose-nodejs-mysql/#Nodejs_and_MySQL_with_Docker_Overview

### Project Components

PROJECT `root` folder:
  docker-compose.yml file to orchestrate containers

* FRONTEND
  `/client`
    - ReactJS frontend  
      - ngnix.conf file 
      - Dockerfile to build frontend image 

* BACKEND
  `/server`
    - Node TypeScript API 
      - Tests written in Jest
      - Data stored in MySQL
      - API documented in Swagger
      - Dockerfile to build backend image 


### Project Setup 

1. Configure .env files to match MySQL db connection and Docker ports
  - in the current `'root'` folder
  - in REST API folder  `/server`
```sh
cp .env-sample .env
```

2. Build NodeJS + MySQL containers. 
```sh
docker-compose up
```

Or, run services in the background
```sh
docker-compose up -d
```

3. Access frontend at `{url}/api/v1/API_ENDPOINT`

4. Stop all containers
```sh
docker-compose down
```

Stop and remove all containers, networks, and images used by any service in docker-compose.yml file
```sh
  docker-compose down --rmi all
```
