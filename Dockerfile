
FROM node:16
WORKDIR /usr
COPY package*.json ./
RUN npm install
COPY .env ./
COPY ../bin ./bin
RUN mkdir data
RUN ["node", "./bin/generate-data.js"]
COPY ../src ./src
COPY tsconfig.json ./
COPY tsconfig.build.json ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:dev"]