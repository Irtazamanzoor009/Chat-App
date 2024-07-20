const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Provide name"] },
    email: { type: String, required: [true, "Provdie Email"] },
    password: { type: String, required: [true, "Provide Password"] },
    profile_pic: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
