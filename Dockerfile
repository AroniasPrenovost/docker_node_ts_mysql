FROM mhart/alpine-node:12.16.3  
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY ./build /build
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.jsonRUN NODE_ENV=$NODE_ENV npm install
CMD ["node", "build/index.js"]