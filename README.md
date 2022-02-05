# Dockerized RESTful API With Node, TypeScript, Express and MySQL

This repo is an example of how to Dockerize Nodejs Express and MySQL using Docker Compose: https://www.bezkoder.com/docker-compose-nodejs-mysql/#Nodejs_and_MySQL_with_Docker_Overview

### Project Setup - Nodejs MySQL with Docker Compose

1. Configure .env files to match MySQL database connection in the current `'root'` folder and `/rest_api`
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

3. Access frontend at {url}/api/v1/API_ENDPOINT

4. Stop all containers
```sh
docker-compose down
```

Stop and remove all containers, networks, and all images used by any service in docker-compose.yml file
```sh
docker-compose down --rmi all
```
