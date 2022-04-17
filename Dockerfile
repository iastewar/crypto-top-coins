FROM node:17-slim

WORKDIR /crypto-top-coins/client
COPY client/package*.json ./
RUN npm ci
WORKDIR /crypto-top-coins/server
COPY server/package*.json ./
RUN npm ci

WORKDIR /crypto-top-coins
COPY . ./
RUN sh build.sh

WORKDIR /crypto-top-coins/server
ARG NODE_ENV=production
EXPOSE 8080
CMD ["npm", "start"]
