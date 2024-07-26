import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setOnlineUser,
  setsocketConnection,
  setUser,
} from "../../../redux/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import "./homepage.css";
import Avatar from "../../Avatar";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import UploadFile from "../../../helpers/uploadFile";
import toast from "react-hot-toast";
import messagelogo from "../../../assets/message logo.png";
import UserSearchCard from "./UserSearchCard";
import _ from "lodash";
import MessagePage from "../../MessagePage";
import io from "socket.io-client";
import moment from "moment";

const HomePage = ({ ischat }) => {
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state.user);
  const [InfoData, setInfoData] = useState({
    name: "",
    profile_pic: "",
  });
  const [showProfileInfo, setshowProfileInfo] = useState(false);
  const [viewUsers, setviewUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // all users in message section
  const [allUsers, setallUsers] = useState([]);
  // all users in search menu
  const [userlist, setuserlist] = useState([]);

  const [search, setsearch] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/checkemailpage");
    toast.success("User Log Out Successfully");
    localStorage.clear();
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("sideBarConversation", (allMessages) => {
        // console.log("Side bar messages:::", allMessages);
        const ConversationData = allMessages.map((ConversationUser, index) => {
          if (
            ConversationUser?.sender?._id === ConversationUser?.receiver?._id
          ) {
            return {
              ...ConversationUser,
              userDetails: ConversationUser?.sender,
            };
          } else if (ConversationUser?.receiver?._id !== user?._id) {
            return {
              ...ConversationUser,
              userDetails: ConversationUser?.receiver,
            };
          } else {
            return {
              ...ConversationUser,
              userDetails: ConversationUser?.sender,
            };
          }
        });
        // console.log("COnversation Data: ", ConversationData);
        // console.log("Conversation Last Msg:",ConversationData?.lastMsg)
        setallUsers(ConversationData);
      });
    }
  }, [socketConnection, user]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUserDetails();
    } else if (!localStorage.getItem("token")) {
      navigate("/checkemailpage");
    }
  }, []);

  const handleSearchUser = useCallback(
    _.debounce(async (searchTerm) => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
        const response = await axios.post(url, { search: searchTerm });

        setuserlist(response?.data?.data);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }, 300),
    [] // 300 ms debounce delay
  );

  useEffect(() => {
    handleSearchUser(search);
  }, [search, handleSearchUser]); 

  // socket connection

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      // console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setsocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  //-------------------------
  // form handling functions
  // -------------------------

  const fetchUserDetails = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: url,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/checkemailpage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfoData({
      ...InfoData,
      [name]: value,
    });
  };

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];

    setIsLoading(true);
    const uploadPhoto = await UploadFile(file);
    setTimeout(() => {
      setInfoData((prev) => {
        return {
          ...prev,
          profile_pic: uploadPhoto?.url,
        };
      });
      setIsLoading(false);
    }, 300);
  };

  const handleSubmitInfoBox = async (e) => {
    e.preventDefault();
    console.log(InfoData);
    try {
      console.log("try");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`;
      const response = await axios({
        method: "post",
        url: url,
        data: InfoData,
        withCredentials: true,
      });
      console.log(response.data);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      }
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const OpenInfoBox = () => {
    setshowProfileInfo(true);
    setInfoData({
      name: user.name,
      profile_pic: user.profile_pic,
    });
  };

  const handlesearch = (e) => {
    const value = e.target.value;
    setsearch(value);
  };

  

  return (
    <>
      <div className="main-cointainer">
        <div className="main">
          <div className="side-icon">
            <div className="upper">
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  `icon  ${isActive ? "active" : ""}`
                }
              >
                <i title="Chat" className="fa-solid fa-message-dots"></i>
              </NavLink>

              <i
                title="Add User"
                onClick={() => setviewUsers(true)}
                className=" fa-solid fa-user-plus"
              ></i>
            </div>
            <div className="below">
              <button
                onClick={OpenInfoBox}
                title={user.name}
                className="btn-profile"
              >
                <Avatar
                  width={30}
                  height={30}
                  imageURL={user.profile_pic}
                  userId={user._id}
                />
              </button>
              <i
                onClick={handleLogOut}
                title="logout"
                className="icon fa-solid fa-left-from-bracket"
              ></i>
            </div>
          </div>
          <div className="search-people">
            <div className="top">
              <h2>Message</h2>
              <hr />
            </div>
            <div className="content">
              {allUsers.length === 0 ? (
                <div className="content-inner">
                  <i className="fa-solid fa-arrow-up-left"></i>
                  <p>Explore users to start a conversation with.</p>
                </div>
              ) : (
                allUsers.map((conv, index) => {
                  return (
                    <>
                      <div className="sidebar-nav">
                        <NavLink
                          to={"/" + conv?.userDetails?._id}
                          className="sidebar-user-section"
                          key={conv?._id}
                        >
                          <div className="sidebar-parent">
                            <div className="sidebar-image">
                              <Avatar
                                imageURL={conv?.userDetails?.profile_pic}
                                width={45}
                                height={45}
                              />
                            </div>
                            <div className="name-msg-content">
                              <h2>{conv?.userDetails?.name}</h2>
                              {conv?.lastMsg?.imageUrl && (
                                <div className="sidebar-msg-image">
                                  <i class="fa-solid fa-camera"></i>{" "}
                                  <p>Image</p>{" "}
                                </div>
                              )}
                              {conv?.lastMsg?.videoUrl && (
                                <p className="sidebar-msg-image">
                                  <i class="fa-solid fa-video"></i> Video
                                </p>
                              )}
                              <p className="text-msg-shown">
                                {conv?.lastMsg?.text}
                              </p>
                              {/* <p>{conv?.userDetails?.lastMsg?.text}</p> */}
                            </div>
                            <div className="sidebar-date-section">
                              <p className="date-sidebar">
                                {moment(conv?.lastMsg?.updatedAt).format("LT")}
                              </p>
                              {conv?.UnseenMsg !== 0 && (
                                <p className="Unread">{conv?.UnseenMsg}</p>
                              )}
                            </div>
                          </div>
                        </NavLink>
                        {/* <hr className="side-bar-hr" /> */}
                      </div>
                    </>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {!ischat ? (
          <div className="message-section">
            <div className="message-container">
              <div className="message-wraper">
                <img src={messagelogo} alt="logo" />
                <p>Select user to send message</p>
              </div>
            </div>
          </div>
        ) : (
          <MessagePage />
        )}
      </div>

      <Modal
        show={showProfileInfo}
        onClose={() => setshowProfileInfo(false)}
        title="Profile Details"
      >
        <h3>Edit User Details</h3>
        <form action="" onSubmit={handleSubmitInfoBox}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={InfoData.name}
            onChange={handleChange}
          />

          <label htmlFor="profile_pic">Photo:</label>
          <div className="downer">
            <div className="img-container">
              <Avatar imageURL={InfoData.profile_pic} width={45} height={45} />
            </div>
            <div className="custom-file-input">
              <input type="file" onChange={handleUploadPhoto} />
              <span>
                Change Photo{" "}
                {isLoading && <i className="fa-solid fa-spinner fa-spin"></i>}
              </span>
            </div>
          </div>
          <hr className="form-hr" />
          <div className="edit-buttons">
            <button onClick={handleSubmitInfoBox} type="submit">
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        show={viewUsers}
        onClose={() => setviewUsers(false)}
        title="Search Users"
      >
        <div className="search-user-form">
          <input
            type="search"
            placeholder="Search User"
            onChange={handlesearch}
          />
        </div>
        <div className="user-list">
          {userlist.length === 0 ? (
            <div className="user-list-text">No User Present</div>
          ) : (
            userlist.map((user, index) => {
              return (
                <UserSearchCard
                  key={user._id}
                  user={user}
                  userId={user._id}
                  onclose={() => setviewUsers(false)}
                />
              );
            })
          )}
        </div>
      </Modal>
    </>
  );
};

export default HomePage;
