FROM node:slim
WORKDIR /
COPY . /
RUN npm install
EXPOSE 5000
CMD node index.js