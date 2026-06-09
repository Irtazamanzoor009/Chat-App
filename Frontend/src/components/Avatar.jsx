import React from "react";
import { useSelector } from "react-redux";
import person from "../assets/person.png";
import "./avatar.css";

const Avatar = ({ userId, name, imageURL, width, height }) => {
  const OnlineUser = useSelector((state) => state?.user?.onlineUser);
  const isOnline = OnlineUser.includes(userId);
  return (
    <>
      <div className="profile-image">
        {imageURL ? (
          <img
            src={imageURL}
            width={width}
            height={height}
            alt="Person Image"
          />
        ) : (
          <img
            className="default-logo"
            src={person}
            width={width}
            height={height}
          />
        )}
        {isOnline && <div className="online-dot"></div>}
      </div>
      <div className="profile-name">
        <h2>{name}</h2>
      </div>
    </>
  );
};

export default Avatar;
