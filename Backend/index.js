const express = require('express')
const cors = require('cors');
require('dotenv').config()
const connection = require('./config/DBConnection')
const router = require('./Routes/route')
const cookieParser = require('cookie-parser') 
const {app, server} = require('./socket/index.js')

// const app = express()

app.use(cors({
    // origin: "http://localhost:5173/",
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus:200,
    methods: ["GET", "POST","PUT"],
}))
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send("Hello world")
})

// api end points
app.use('/api',router)

const PORT = process.env.PORT || 8080;

connection().then(()=>{
    server.listen(PORT,()=>{
        console.log("Server running at port ", PORT)
    })

})
