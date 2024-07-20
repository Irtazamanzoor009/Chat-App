const mongoose = require('mongoose');

const connection = async()=>{
    try
    {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        connection.on('connected',()=>{
            console.log("MongoDB connected successfully")
        })

        connection.on('error',()=>{
            console.log("There is some error in MongoDB Connection", error)
        })
        // console.log("Server connected successfully")
    }
    catch(error)
    {
        console.log("ERROR: at connection MongoDB ", error)
    }
}

module.exports = connection