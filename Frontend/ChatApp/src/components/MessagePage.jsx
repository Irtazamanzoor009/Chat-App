import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import messagelogo from "../assets/message logo.png";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import UploadFile from "../helpers/uploadFile";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [plusClicked, setplusClicked] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);

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
    videoUrl: ""
  });

  useEffect(() => {
    if (socketConnection && params.userId) {
      socketConnection.emit("messagepage", params.userId);
      socketConnection.on("message-user", (data) => {
        setuserdata(data);
        console.log("User data received:", data);
      });
    }
  }, [socketConnection, params.userId, user]);

  const handleplusClicked = () => {
    setplusClicked(!plusClicked);
  };

  const handleUploadImage = async(e)=>
  {
    const file = e.target.files[0];

    setIsLoading(true);
    const uploadPhoto = await UploadFile(file);
    setTimeout(() => {
      setmessage((prev) => {
        return {
          ...prev,
          imgUrl: uploadPhoto?.url,
        };
      });
      setIsLoading(false);
    }, 300);
  }

  const handleUploadVideo = async(e)=>
  {
    const file = e.target.files[0];

    setIsLoading(true);
    const uploadPhoto = await UploadFile(file);
    setTimeout(() => {
      setmessage((prev) => {
        return {
          ...prev,
          videoUrl: uploadPhoto?.url,
        };
      });
      setIsLoading(false);
    }, 300);
  }

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

                  <input type="file" id="uploadImage" onChange={handleUploadImage}/>
                  <input type="file" id="uploadVideo" onChange={handleUploadVideo}/>
                </form>
              </div>
            )}
            <div className={`plus-icon ${plusClicked && "isactive"}`} onClick={handleplusClicked}>
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
