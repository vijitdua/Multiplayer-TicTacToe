FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]

#LABEL authors="vijit"
#
#ENTRYPOINT ["top", "-b"]