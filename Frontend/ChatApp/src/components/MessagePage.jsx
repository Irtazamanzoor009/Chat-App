import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import messagelogo from "../assets/message logo.png";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import UploadFile from "../helpers/uploadFile";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [plusClicked, setplusClicked] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const currentMessage = useRef(null);
  const [allMessages, setallMessages] = useState([]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);

  const [userdata, setuserdata] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });

  const [message, setmessage] = useState({
    text: "",
    imgUrl: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (socketConnection && params.userId) {
      socketConnection.emit("messagepage", params.userId);

      socketConnection.emit('seen',params.userId)

      socketConnection.on("message-user", (data) => {
        setuserdata(data);
        console.log("User data received:", data);
      });
      socketConnection.on("message", (data) => {
        setallMessages(data);
        console.log("Message data", data);
      });
    }
  }, [socketConnection, params.userId, user]);

  const handleplusClicked = () => {
    setplusClicked(!plusClicked);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setIsLoading(true);
    const uploadPhoto = await UploadFile(file);
    console.log(uploadPhoto.url);
    setmessage((prev) => {
      return {
        ...prev,
        imgUrl: uploadPhoto?.url,
      };
    });
    setIsLoading(false);
    setplusClicked(false);
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setIsLoading(true);
    const uploadPhoto = await UploadFile(file);

    setmessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadPhoto?.url,
      };
    });
    setIsLoading(false);
    setplusClicked(false);
  };

  const hanldeImageCross = () => {
    setmessage(message.imgUrl === "" && message.videoUrl === "");
  };

  const handleMessageInputBox = (e) => {
    const { name, value } = e.target;
    setmessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
    //  console.log(message.text)
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imgUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("newMessage", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageURL: message.imgUrl,
          videoURL: message.videoUrl,
          msgByUserId: user?._id,
        });
      }
      setmessage({
        text: "",
        imgUrl: "",
        videoUrl: "",
      });
    }
  };

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
        <section className="chat-section">
          {/* all messages */}
          <div className="messages-section" ref={currentMessage}>
            {allMessages.map((msg, index) => {
              return (
                <div
                  className={`message-strip ${
                    user._id === msg.msgByUserId ? "msg-by-sender" : ""
                  }`}
                >
                  <div>
                    {msg?.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="image"
                        width={300}
                        height={300}
                      />
                    )}
                  </div>
                  <div>
                    {msg?.videoUrl && (
                      <video
                        src={msg.videoUrl}
                        width={300}
                        height={300}
                        controls
                        muted
                      ></video>
                    )}
                  </div>
                  <p className="msg-text">{msg.text}</p>
                  <p className="message-sent-date">
                    {moment(msg.createdAt).format('LT')}
                  </p>
                </div>
              );
            })}
          </div>
          {IsLoading && (
            <div className="loading-page">
              <i class="fa-duotone fa-solid fa-spinner-third fa-spin"></i>
            </div>
          )}
          {message.imgUrl && (
            <div className="image-display">
              <div onClick={hanldeImageCross} className="cross-icon">
                <i class="fa-solid fa-xmark"></i>
              </div>

              <div className="actual-image">
                <div className="image-section">
                  <img
                    src={message.imgUrl}
                    width={320}
                    height={300}
                    alt="image"
                  />
                </div>
              </div>
              <form action="" onSubmit={handleSendMessage}>
                <div className="image-icon">
                  <input
                    type="text"
                    placeholder="Add a Caption"
                    value={message.text}
                    onChange={handleMessageInputBox}
                  />
                  <button className="send-icon image-send-icon">
                    <i class="fa-solid fa-paper-plane-top"></i>
                  </button>
                </div>
              </form>
            </div>
          )}

          {message.videoUrl && (
            <div className="image-display">
              <div onClick={hanldeImageCross} className="cross-icon">
                <i class="fa-solid fa-xmark"></i>
              </div>

              <div className="actual-image">
                <div className="video-section aspect-ratio-container">
                  <video
                    src={message.videoUrl}
                    className="video-set"
                    controls
                    muted
                    autoPlay
                  ></video>
                </div>
              </div>
              <form action="" onSubmit={handleSendMessage}>
                <div className="image-icon">
                  <input
                    type="text"
                    placeholder="Add a Caption"
                    value={message.text}
                    onChange={handleMessageInputBox}
                  />
                  <button className="send-icon image-send-icon">
                    <i class="fa-solid fa-paper-plane-top"></i>
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
        {!message.imgUrl && !message.videoUrl && (
          <section className="chat-box">
            <div className="chat-box-content">
              {plusClicked && (
                <div className="sent-options">
                  <form className="plus-form" action="">
                    <label className="upload up-img" htmlFor="uploadImage">
                      <div>
                        <i class="u-img fa-regular fa-image"></i>
                      </div>
                      <p>Image</p>
                    </label>
                    <label className="upload up-vid" htmlFor="uploadVideo">
                      <div>
                        <i class="u-vid fa-solid fa-video"></i>
                      </div>
                      <p>Video</p>
                    </label>

                    <input
                      type="file"
                      id="uploadImage"
                      onChange={handleUploadImage}
                    />
                    <input
                      type="file"
                      id="uploadVideo"
                      onChange={handleUploadVideo}
                    />
                  </form>
                </div>
              )}
              <div
                className={`plus-icon ${plusClicked && "isactive"}`}
                onClick={handleplusClicked}
              >
                <i class="fa-solid fa-plus"></i>
              </div>

              <form action="" onSubmit={handleSendMessage}>
                <div className="enter-message">
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={message.text}
                    onChange={handleMessageInputBox}
                  />
                  <button className="send-icon">
                    <i class="fa-solid fa-paper-plane-top"></i>
                  </button>
                </div>
              </form>

              {/* <div className="send-message">
                <i class="fa-solid fa-paper-plane-top"></i>
              </div> */}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default MessagePage;
