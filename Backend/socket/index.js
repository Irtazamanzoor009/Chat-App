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

      io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
      io.to(data?.receiver).emit("message", getConversationMessage?.messages || []);
    });

    // side bar messages
    socket.on("sidebar", async (CurrentUserId) => {
      console.log("Side Bar Id: ", CurrentUserId);

      if (CurrentUserId) {
        const CurrentUserConversations = await ConversationModel.find({
          $or: [{ sender: CurrentUserId }, { reciever: CurrentUserId }],
        }).sort({ updatedAt: -1 })
        .populate("messages").populate("sender").populate("receiver")

        // console.log("Current User Conversation", CurrentUserConversations);

        const ConversationPayload = CurrentUserConversations.map((Convmsg) => {
          const CountUnSeenMsg = Convmsg.messages.reduce(
            (prev, curr) => prev + (curr.seen ? 0 : 1),
            0
          );

          return {
            _id: Convmsg?._id,
            sender: Convmsg?.sender,
            receiver: Convmsg?.receiver,
            UnseenMsg: CountUnSeenMsg,
            lastMsg: Convmsg.messages[Convmsg?.messages?.length - 1],
          };
        });

        socket.emit("sideBarConversation", ConversationPayload);
      }
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
