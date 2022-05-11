# stage: 1
FROM node:12
WORKDIR /app
COPY . /app
# RUN npm install 

RUN npm install -g nodemon
RUN npm install -g ts-node

CMD [ "npm", "start" ]