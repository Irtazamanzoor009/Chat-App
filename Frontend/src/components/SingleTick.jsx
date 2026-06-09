import React from "react";

const SingleTick = ({coordinates}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="18px"
    viewBox={coordinates}
    width="25px"
    fill="#5f6368"
  >
    <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
  </svg>
);

export default SingleTick;
