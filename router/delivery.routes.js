const express = require("express");
const {
  createDelivery,
  addTrackingUpdate,
  getDeliveryDetails,
} = require("../controller/deliveryController");
const Route = express.Router();

Route.post("/deliveries", createDelivery);
Route.put("/deliveries/:id/track", addTrackingUpdate);
Route.get("/deliveries/:id", getDeliveryDetails);

module.exports = Route;
