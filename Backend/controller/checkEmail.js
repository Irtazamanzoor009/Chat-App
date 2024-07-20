const UserModel = require("../Models/UserModel");

const CheckEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const isEmailPresent = await UserModel.findOne({ email }).select("-password");
    if (!isEmailPresent) {
      return res.status(400).json({
        message: "User Not Exist",
        error: true,
      });
    }

    return res.status(200).json({
        message: "Email Verified",
        success: true,
        data: isEmailPresent
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

module.exports = CheckEmail
