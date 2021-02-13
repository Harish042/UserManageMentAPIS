const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const connectDB = require("./connections/mongo");
const app = express();
const user = require("./routes/users");
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 8000;
app.use(morgan("dev"));
app.use(express.json());
connectDB();
app.use("/api/v1/", user);
let server = app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
module.exports = server