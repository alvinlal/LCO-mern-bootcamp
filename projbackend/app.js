const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoute = require("./routes/stripePayment");
const paymentBRoutes = require("./routes/brainTreePayment");
//Db connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MONGODB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoute);
app.use("/api", paymentBRoutes);

app.listen(port, () => console.log(`listening at ${port}`));
