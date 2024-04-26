const express = require("express");
const connect = require("./DB/mongoose");
const userRoute = require("./router/user.routes");
const categoryRoute = require("./router/category.routes");
const productRoute = require("./router/product.routes");
const productVariantRoute = require("./router/productVariant.routes");
const wishlist = require("./router/wishlist.routes");
const cardList = require("./router/cart.routes");
const app = express();

app.use(express.json());
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/productVariant", productVariantRoute);
app.use("/wishlist", wishlist);
app.use("/cart", cardList);
connect();

app.listen(3000, () => {
  console.log("Server is running");
});
