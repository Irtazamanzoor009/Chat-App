import React, { useState,useEffect } from "react";
import Header from "../../Header";
import "../RegisterPage/register.css";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import person from "../../../assets/person.png";
import Avatar from "../../Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../../../redux/userSlice";
import { toast } from "react-hot-toast";

const CheckPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if(!location?.state?.name)
    {
      navigate('/checkemailpage')
    }
  }, []);

  const onsubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/checkPassword`;
      const response = await axios({
        method: 'post',
        url: url,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      });
      if (response.data.success) {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
        reset();
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token',response?.data?.token)
        toast.success("User Verified")
        navigate('/')
      }

    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      setServerError(error.response.data.message);
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
            <Avatar name={location?.state?.name} imageURL={location?.state?.profile_pic} width={100} height={100}/>
          </div>
          {serverError && <div className="red msgs">{serverError}</div>}
          {errors.password && (
            <div className="red msgs">{errors.password.message}</div>
          )}
          <form action="" onSubmit={handleSubmit(onsubmit)}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              {...register("password", {
                required: { value: true, message: "Please Enter Password" },
              })}
            />

            <button className="emailCheckbutton" type="submit">
              Login
              {isLoading && <i className="fa-solid fa-spinner fa-spin"></i>}
            </button>

            <p>
               <NavLink to="/forgot-password">Forgot Password?</NavLink>{" "}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckPasswordPage;
