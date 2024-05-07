const express = require("express");

const {
  createUser,
  getUser,
  loginUser,
  addNewAddress,
  getAddressByUserId,
} = require("../controller/userController");

const route = express.Router();

route.post("/register", createUser); //http:localhost:3000/user/create
route.post("/addNewAddress", addNewAddress);
route.post("/getAddressByUserId", getAddressByUserId); //http:localhost:3000/user/create
route.get("/data", getUser);
route.post("/login", loginUser);
module.exports = route;
