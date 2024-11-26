FROM node:18-slim

WORKDIR /app

COPY package*.json ./
COPY server.js ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]