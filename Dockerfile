FROM node:14

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]