 const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Database connection success");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connect;
