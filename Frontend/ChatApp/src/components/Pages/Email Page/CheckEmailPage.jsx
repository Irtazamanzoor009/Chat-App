import React, { useState } from "react";
import Header from "../../Header";
import "../RegisterPage/register.css";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import person from "../../../assets/person.png";

const CheckEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onsubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/checkEmail`;
      const response = await axios.post(url, data);
      console.log(response)
      if (response?.data?.success) {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
        reset();
        navigate('/checkpasswordpage',{
          state: response?.data?.data
        })
      }

    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      console.log(error)
      setServerError(error.response?.data?.message);
      setTimeout(() => {
        setServerError("");
      }, 2000);
    }
  };
  return (
    <>
      <Header />
      <div className="container">
        <div className="wraper">
          <div className="person-logo">
            <img src={person} alt="Person Logo" />
          </div>
          <h2>Welcome to Chat App</h2>
          {serverError && <div className="red msgs">{serverError}</div>}
          {errors.email && (
            <div className="red msgs">{errors.email.message}</div>
          )}
          <form action="" onSubmit={handleSubmit(onsubmit)}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              {...register("email", {
                required: { value: true, message: "Please Enter Email" },
              })}
            />

            <button className="emailCheckbutton" type="submit">
              Let's Go
              {isLoading && <i className="fa-solid fa-spinner fa-spin"></i>}
            </button>

            <p>
              New User? <NavLink to="/registerpage">Register</NavLink>{" "}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckEmailPage;
