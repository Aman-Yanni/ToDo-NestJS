FROM node:16-alpine as development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn 

COPY . .

EXPOSE 3007


CMD ["/bin/sh", "docker-entrypoint.sh"]
