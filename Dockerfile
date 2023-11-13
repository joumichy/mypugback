FROM node:16.20.2


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -f

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
