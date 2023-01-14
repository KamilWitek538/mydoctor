FROM node:10.0

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
CMD yarn run serve
EXPOSE 8080
