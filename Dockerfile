# can use this to build/deploy (alternative to what is in readme)
FROM ubuntu:focal
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y npm
RUN npm install -g n
RUN n 16.13.2
RUN npm install pm2 -g

WORKDIR /react-test
COPY . .
RUN sh build.sh
ARG NODE_ENV=development
EXPOSE 5000

CMD ["pm2-runtime", "./build/app.js"]
