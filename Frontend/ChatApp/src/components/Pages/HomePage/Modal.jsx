import React from 'react';
 import './homepage.css';

const Modal = ({show, onClose, title, children }) => {
  if (!show) {
    return null;
  }
  
  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
