import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import messagelogo from "../assets/message logo.png";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector(state=> state?.user)

  const [userdata, setuserdata] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });

  

  useEffect(() => {
    if (socketConnection && params.userId) {
      socketConnection.emit("messagepage", params.userId);
      socketConnection.on("message-user", (data) => {
        setuserdata(data);
        console.log("User data received:", data);
      });
    }
  }, [socketConnection, params.userId,user]);

  return (
    <>
      <div className="message-main">
        <header>
          <div className="user-detail">
            <div className="image">
              <Avatar
                width={40}
                height={40}
                imageURL={userdata.profile_pic}
                userId={userdata._id}
              />
            </div>
            <div className="name-content">
              <h2>{userdata.name}</h2>
              {userdata.online ? (
                <p className="green-bg">Online</p>
              ) : (
                <p className="gray-bg">Offline</p>
              )}
            </div>
          </div>
          <div className="right-icon">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </div>
        </header>
        <section className="chat-section">a</section>
        <section className="chat-box">
          <div className="chat-box-content">
            <div className="plus-icon">
              <i class="fa-solid fa-plus"></i>
            </div>
            <div className="enter-message">
              <input type="text" placeholder="Type a message" />
            </div>
            <div className="send-message">
              <i class="fa-solid fa-paper-plane-top"></i>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MessagePage;
