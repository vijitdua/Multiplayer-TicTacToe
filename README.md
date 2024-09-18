# Multiplayer, Full Stack, TicTacToe

---

## What is this?

An app that lets you play TicTacToe online with your friends! Built to quickly learn react and nodeJS.

This is also my **first-ever web project**, **backend project**, and **JS project** in general. Before this, I had only worked on CLI-based projects. Pardon the poor file structure and code style, newer projects have better code :).

---

## Preview

- <img width="300" alt="Screenshot 2024-06-06 at 1 48 55 PM" src="https://github.com/vijitdua/Multiplayer-TicTacToe/assets/82555472/56672ae3-5269-45c2-8879-d956c39cd8fa">

- <img width="300" alt="image" src="https://github.com/vijitdua/Multiplayer-TicTacToe/assets/82555472/606560dd-1b34-4c62-ba9a-88c6e43fc991">

- <img width="500" alt="image" src="https://github.com/vijitdua/Multiplayer-TicTacToe/assets/82555472/0f46b35c-29d6-4722-8201-c33389dbbc0f">

- <img width="500" alt="image" src="https://github.com/vijitdua/Multiplayer-TicTacToe/assets/82555472/2ab9f01d-075d-406c-8b2a-b1ae08ea8b8a">

- <img width="500" alt="image" src="https://github.com/vijitdua/Multiplayer-TicTacToe/assets/82555472/3067400d-f3f2-4e0d-8328-2b8ad34a6f21">

- <img width="500" alt="image" src="https://github.com/vijitdua/Multiplayer-TicTacToe/assets/82555472/05eaff17-469c-4025-915b-c5f06827fcbd">

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
