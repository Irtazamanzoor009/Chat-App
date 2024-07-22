import React from 'react';
import './style.css'
import messagelogo from '../assets/message logo.png'

const MessagePage = () => {
  return (
    <>
    <div className="message-container">
      <div className="message-wraper">
        <img src={messagelogo} alt="logo" />
        <p>Select user to send message</p>
      </div>
    </div>
    </>
  );
}

export default MessagePage;
