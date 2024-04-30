# Multiplayer, Full Stack, TicTacToe

---

## What is this?

An app that lets you play TicTacToe online with your friends!

[Check it out online yourself!](http://tic.vijitdua.com)

---

## Tech Stack

### Frontend

Built with React.js, Material UI, and deployed through Docker, running on aws EC2 container.

### Backend

Build with express.js on Node.js, MySQL, and deployed through Docker Compose, running on aws EC2 container.

---

## Run Locally

This app is already hosted on the web if you want to [check it out](http://tic.vijitdua.com). This guide is only for forking.

This guide assumes you are either running a Linux or Mac machine, for non-unix based machines please
appropriately translate the commands and running setup.

This guide also assumes that your port 3000 and 3005 are empty, if not you must either close any processes running on
those ports or change the app posts in the .env or docker-compose.yml.

### Backend

You can run this in two ways, either through docker or npm. We recommend using docker for the backend.

#### Through Docker

- Install the docker engine.
- Open `/server`
- run `sudo docker compose -p tic-tac-toe-server up --build`


##### Through NPM

- Install node.js onto your machine.
- Install mysql onto your machine.
- Configure a .env similar to the .env.sample for your app, and set up MY_SQL appropriately with the .env. 
- run `sudo npm install`
- run `sudo npm start`

### FrontEnd

This can also be run through both docker or npm.

#### Through Docker

- Install the docker engine.
- Open `/client`
- run `sudo docker build . -t tic-tac-toe-app`
- run `sudo docker run -p 3000:3000 tic-tac-toe-app`

#### Through NPM

- Install node.js onto your machine.
- Open `/client`
- Run `sudo npm install`
- Run `sudo npm start`

---
