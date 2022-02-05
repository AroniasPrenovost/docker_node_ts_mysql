FROM node:10

WORKDIR /rest_api
COPY package.json .
RUN npm install
COPY . .
CMD npm start