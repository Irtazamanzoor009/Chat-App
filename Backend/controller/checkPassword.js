const UserModel = require("../Models/UserModel");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const CheckPassword = async (req, res) => {
  try {
    const {password, userId} = req.body;
    const checkUser = await UserModel.findById(userId);
    if(!checkUser)
    {
      return res.status(400).json({
        message: "User Not Found",
        error: true,
    })
    }

    const verifyPassword = await bcryptjs.compare(password, checkUser.password)

    if(!verifyPassword)
    {
        return res.status(400).json({
            message: "Invalid Password",
            error: true,
        })
    }

    const tokenData = {
        id: checkUser._id,
        email : checkUser.email
    }

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{expiresIn: '1d'})

    const cookieOptions = {
        http: true,
        secure: true
    }


    return res.cookie('token',token,cookieOptions).status(200).json({
        message: "Login Successfully",
        token: token,
        success: true
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

module.exports = CheckPassword
