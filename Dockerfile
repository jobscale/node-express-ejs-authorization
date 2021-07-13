FROM node:lts-buster-slim
SHELL ["bash", "-c"]
WORKDIR /home/node
COPY . .
RUN npm i --production && chown -R node. . && mv db.example db
USER 1000
CMD ["npm", "start"]
