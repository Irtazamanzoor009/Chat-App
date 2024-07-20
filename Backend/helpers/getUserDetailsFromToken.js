const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");

const GetUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "Session Expired",
      logout: true,
    };
  }

  const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = UserModel.findById(decode.id).select("-password");
  return user
  
};

module.exports = GetUserDetailsFromToken;
