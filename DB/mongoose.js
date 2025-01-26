const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
  const encodedURI = encodeURIComponent(process.env.DATABASE_URL);

  mongoose
    .connect(encodedURI)
    .then(() => {
      console.log('Database connection success');
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connect;
