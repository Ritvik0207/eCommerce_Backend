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
const collectionRoutes = require("./router/collection.routes");
const commentRatingRoutes = require("./router/commentRating.routes");
const deliveryRoutes = require("./router/delivery.routes");
const footerSubHeadingRoutes = require("./router/footerSubHeading.routes");
const footerLinkRoutes = require("./router/footerlink.routes");
const footerRoutes = require("./router/footer.routes");
const aboutusRoutes = require("./router/aboutus.routes");
const pricerangeRoutes = require("./router/priceRange.routes");

const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("node:crypto");
const errorHandler = require("./errorHandler");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();

// const allowedOrigins = [
//   "https://eyongkart.com",
//   "https://user-site.vercel.app", // Replace with your actual Vercel URL for the user site
//   "https://admin-site.vercel.app" // Replace with your actual Vercel URL for the admin site
// ];
app.use(cors());

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
// }));

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
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
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

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
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
app.use("/collection", collectionRoutes);
app.use("/commentrating", commentRatingRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/footersub", footerSubHeadingRoutes);
app.use("/footerlink", footerLinkRoutes);
app.use("/footer", footerRoutes);
app.use("/aboutus", aboutusRoutes);
app.use("/pricerange", pricerangeRoutes);
app.use("/address", addressRoutes);
app.use(errorHandler);
connect();

app.listen(PORT, () => {
  console.log("Server is running");
});
