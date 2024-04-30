FROM node:21

#ENV REACT_APP_SERVER=http://tic-server.vijitdua.xyz

ENV REACT_APP_SERVER=http://localhost:3005

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]
