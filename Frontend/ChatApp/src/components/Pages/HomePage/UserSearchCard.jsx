import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Avatar";
import "./search.css";

const UserSearchCard = ({userId, user, onclose }) => {
  return (
    <>
      <div className="search-upper">
        <hr className="search-hr" />
        <Link to={'/'+user?._id} onClick={onclose} className="search-main">
          <div className="search-image">
            <Avatar width={45} height={45} imageURL={user.profile_pic} userId={user._id} />
          </div>
          <div className="search-content">
            <p className="search-user-name">{user.name}</p>
            <p className="search-user-email">{user.email}</p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default UserSearchCard;
