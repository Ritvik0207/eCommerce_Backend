const deliveryModel = require("../models/deliveryModel");
const orderModel = require("../models/orderModel");

// Create a new delivery entry linked to an order
const createDelivery = async (req, res) => {
  try {
    const { orderId, estimatedDeliveryTime } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const newDelivery = await deliveryModel.create({
      orderId,
      estimatedDeliveryTime,
      status: "ordered",
    });
    res.status(201).json({
      success: true,
      message: "New delivery was created successfully",
      newDelivery,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Add a tracking update to an existing delivery
const addTrackingUpdate = async (req, res) => {
  try {
    const { location, status } = req.body;
    const delivery = await deliveryModel.findByIdAndUpdate(
      req.params.id,
      { status, $push: { trackingUpdates: { location, status } } },
      { new: true }
    );

    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    res.status(200).json({
      success: true,
      message: "New delivery location was updated successfully",
      delivery,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add tracking update" });
  }
};

// Get delivery details with tracking updates
const getDeliveryDetails = async (req, res) => {
  try {
    const delivery = await deliveryModel
      .findById(req.params.id)
      .populate("orderId");
    if (!delivery)
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
        delivery,
      });
    res.status(200).json({
      success: true,
      message: "Fetching delivery details",
      newDelivery,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch delivery details" });
  }
};

module.exports = {
  createDelivery,
  addTrackingUpdate,
  getDeliveryDetails,
};
