const express = require("express");
const { createAddress, getAddress } = require("../utils/address.utils");

const router = express.Router();

router.post("/createAddress", createAddress);
router.get("/getAddress", getAddress);

module.exports = router;
