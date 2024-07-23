const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const GetUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
require('dotenv').config()

const app = express();

//----------------- socket connections -----------------

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

//online user
const OnlineUser = new Set()

io.on("connection", async (socket) => {
  console.log("Connected User", socket.id);

  const token = socket.handshake.auth.token;

  // Current user details
  const userdetails = await GetUserDetailsFromToken(token);
  
  if (userdetails?._id) {
    // Create room and add user to online set
    socket.join(userdetails._id);
    OnlineUser.add(userdetails._id);

    // Emit the updated list of online users
    io.emit('onlineUser', Array.from(OnlineUser));

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("Disconnect user", socket.id);
      OnlineUser.delete(userdetails._id);
      io.emit('onlineUser', Array.from(OnlineUser));
    });
  }
});

module.exports = {
    app,
    server
}
