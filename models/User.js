const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    secretanswers: { type: Array },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
