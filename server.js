const dotenv = require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 4000;

// Routes import
const authRouter = require("./routes/auth/auth.routes"); // auth.routes.js

const app = express();
const { connect: connectDB } = require("mongoose");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRouter);

connectDB(process.env.DB_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(`Could not establish connection: ${err}`);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, msg: "something went wrong" });
  next(err);
});

app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "Welcome to the api",
  });
});

app.use((req, res, next) => {
  res.status(404).json({ msg: "Page not found please check the url" });
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
