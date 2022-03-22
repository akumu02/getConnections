FROM node:16.13.0-alpine
 
COPY . /app
WORKDIR /app

ENV NODE_ENV production
EXPOSE $PORT

RUN cd /app; npm install
CMD ["node","server.js"]