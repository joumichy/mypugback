FROM node:12


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -f

COPY . .
RUN npm build
EXPOSE 3000
CMD ["node", "dist/index.js"]
