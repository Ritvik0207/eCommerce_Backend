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
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/productVariant", productVariantRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cardListRoutes);
app.use("/order", orderProductRoutes);
app.use("/carousel", carouselRoutes);
// app.use("/address", addressRoutes);
connect();

app.listen(3000, () => {
  console.log("Server is running");
});
