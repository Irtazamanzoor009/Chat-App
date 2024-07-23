const UserModel = require('../Models/UserModel')

const SearchUser = async(req,res)=>{
    try
    {
        const {search} = req.body
        const query = new RegExp(search,"i","g")
        
        const user = await UserModel.find({
            "$or" :[
                {name: query},
                {email: query}
            ]
        }).select("-password")
        return res.status(200).json({
            messaeg: "all users",
            data: user,
            success: true
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

module.exports = SearchUser