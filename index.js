const express = require("express");
const connect = require("./DB/mongoose");
const userRoutes = require("./router/user.routes");
const categoryRoutes = require("./router/category.routes");
const productRoutes = require("./router/product.routes");
const productVariantRoutes = require("./router/productVariant.routes");
const wishlistRoutes = require("./router/wishlist.routes");
const cardListRoutes = require("./router/cart.routes");
const orderProductRoutes = require("./router/order.routes");
const addressRoutes = require("./router/address.routes");
const carouselRoutes = require("./router/carousel.routes");
const contactRoutes = require("./router/contact.routes");
const subCategoryRoutes = require("./router/subCategory.routes");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("node:crypto");
const errorHandler = require("./errorHandler");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post("/order", async (req, res) => {
  try {
    console.log("Test");
    console.log(req.body);
    const { buyProduct, currency, receipt } = req.body;
    const razorpay = new Razorpay({
      key_id: "rzp_test_JIH6EhvgsXj43w",
      key_secret: "l4JlduSRLcbaB5YrcLkwm2x5",
    });

    const options = { amount: buyProduct * 100, currency, receipt };
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error is not a valid order");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", "l4JlduSRLcbaB5YrcLkwm2x5");
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/productVariant", productVariantRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cardListRoutes);
app.use("/order", orderProductRoutes);
app.use("/carousel", carouselRoutes);
app.use("/contact", contactRoutes);
app.use("/subCategory", subCategoryRoutes);
app.use(errorHandler);
// app.use("/address", addressRoutes);
connect();

app.listen(3000, () => {
  console.log("Server is running");
});
