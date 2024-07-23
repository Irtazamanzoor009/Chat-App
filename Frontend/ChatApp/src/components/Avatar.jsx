import React from "react";
import person from "../assets/person.png";
import './avatar.css'

const Avatar = ({ userId, name, imageURL, width, height }) => {
  return (
    <>
      <div className="profile-image">{imageURL ? <img src={imageURL}  width={width} height={height} alt="Person Image"/> : <img className="default-logo" src={person} width={width} height={height}/>}</div>
      <div className="profile-name">
        <h2>{name}</h2>
      </div>
    </>
  );
};

export default Avatar;
