import React from 'react';
import logo from '../assets/logo.png'
import './style.css'

const Header = () => {
  return (
    <>
        <div className="header">
            <img src={logo} alt="logo" width={80}/>
        </div>
    </>
  );
}

export default Header;
