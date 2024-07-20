const GetUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../Models/UserModel");


const UpdateUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await GetUserDetailsFromToken(token);

    const {name, profile_pic} = req.body;
    const UpdateUser = await UserModel.updateOne({_id:user._id},{
        name,
        profile_pic
    })

    const UserInformation = await UserModel.findById(user._id);
    return res.status(200).json({
        message: "User Updated Successfully",
        data: UserInformation,
        success: true
    })
  } catch {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

module.exports = UpdateUserDetails
