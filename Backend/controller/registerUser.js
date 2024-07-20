const UserModel = require('../Models/UserModel')
const bcryptjs = require('bcryptjs')

const registerUser = async(req,res)=>{
    try
    {
        const {name, email, password, profile_pic} = req.body;
        const checkEmail = await UserModel.findOne({email})
        if(checkEmail)
        {
            return res.status(400).json({
                message: "User Already Exists",
                error: true
            })
        }
        // hash password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt)
        const payLoad = {
            name,
            email,
            profile_pic,
            password: hashPassword
        }
        const user = new UserModel(payLoad)
        const UserSave = await user.save()
        return res.status(201).json({
            message: "User Created Successfully",
            data : UserSave,
            success : true
        })
    }
    catch(error)
    {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = registerUser