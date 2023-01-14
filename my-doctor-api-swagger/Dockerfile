FROM node:8.0

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run start
EXPOSE 3091
