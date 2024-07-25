const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const GetUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../Models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../Models/ConversationModel");
require("dotenv").config();
const GetConvsersation = require("../helpers/GetConversation");

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
const OnlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("Connected User", socket.id);

  const token = socket.handshake.auth.token;

  // Current user details
  const userdetails = await GetUserDetailsFromToken(token);

  if (userdetails?._id) {
    // Create room and add user to online set
    socket.join(userdetails?._id.toString());
    OnlineUser.add(userdetails._id?.toString());

    // Emit the updated list of online users
    io.emit("onlineUser", Array.from(OnlineUser));

    socket.on("messagepage", async (userId) => {
      // console.log("userId", userId);
      const user = await UserModel.findById(userId).select("-password");
      const payload = {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        profile_pic: user?.profile_pic,
        online: OnlineUser.has(userId),
      };

      socket.emit("message-user", payload);

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: userdetails?._id, receiver: userId },
          { sender: userId, receiver: userdetails?._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      // get previous message
      socket.emit("message", getConversationMessage?.messages || []);
    });

    //new message
    socket.on("newMessage", async (data) => {
      // check conversation is avaiable for both user
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      //create conversation
      if (!conversation) {
        const createConversation = await ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        conversation = await createConversation.save();
      }

      const message = await MessageModel({
        text: data.text,
        imageUrl: data.imageURL,
        videoUrl: data.videoURL,
        msgByUserId: data?.msgByUserId,
      });

      const saveMessage = await message.save();

      const UpdateConversation = await ConversationModel.updateOne(
        { _id: conversation?._id },
        {
          $push: {
            messages: saveMessage._id,
          },
        }
      );

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(data?.sender).emit(
        "message",
        getConversationMessage?.messages || []
      );
      io.to(data?.receiver).emit(
        "message",
        getConversationMessage?.messages || []
      );

      // send latest conversation
      const convsersationSender = await GetConvsersation(data?.sender);
      const convsersationReciever = await GetConvsersation(data?.receiver);

      io.to(data?.sender).emit("sideBarConversation", convsersationSender);
      io.to(data?.receiver).emit("sideBarConversation", convsersationReciever);
    });

    // side bar messages
    socket.on("sidebar", async (CurrentUserId) => {
      console.log("Side Bar Id: ", CurrentUserId);
      const convsersation = await GetConvsersation(CurrentUserId);
      socket.emit("sideBarConversation", convsersation);
    });

    //seen messages
    socket.on("seen", async (msgByUserId) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: userdetails?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: userdetails?._id },
        ],
      });

      const ConversationMessagesId = conversation?.messages || [];
      const updateMessages = await MessageModel.updateMany(
        {
          _id: { $in: ConversationMessagesId },
          msgByUserId: msgByUserId,
        },
        {
          $set: {seen:true}
        }
      );

      // send latest conversation
      const convsersationSender = await GetConvsersation(userdetails?._id?.toString());
      const convsersationReciever = await GetConvsersation(msgByUserId);

      io.to(userdetails?._id?.toString()).emit("sideBarConversation", convsersationSender);
      io.to(msgByUserId).emit("sideBarConversation", convsersationReciever);
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("Disconnect user", socket.id);
      // console.log("Disconnect user id: ", userdetails._id);
      OnlineUser.delete(userdetails._id.toString());
      io.emit("onlineUser", Array.from(OnlineUser));
    });
  }
});

module.exports = {
  app,
  server,
};
