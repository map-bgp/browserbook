# syntax=docker/dockerfile:1

FROM node:16
ENV NODE_ENV=development

WORKDIR /browserbook/src

COPY package.json /browserbook/src/package.json

RUN npm cache clean --force
RUN npm install --development

EXPOSE 5500

COPY . /browserbook/src
CMD ["npm", "run", "dev"]
