import React, { useState } from "react";
import Header from "../../Header";
import "./register.css";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import UploadFile from "../../../helpers/uploadFile";
import axios from "axios";
import { toast } from "react-hot-toast";

const RegisterPage = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onsubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/register`;
      const response = await axios.post(url, data);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);

        reset();
        setFileName("");
        setValue("profile_pic", "");
      }, 1000);
      toast.success("User Registered Successfully")
      navigate("/checkemailpage");
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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file ? file.name : "");
      try {
        const uploadPhoto = await UploadFile(file);
        setValue("profile_pic", uploadPhoto.secure_url, {
          shouldValidate: true,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
    setValue("profile_pic", "");
    document.getElementById("photo").value = "";
  };
  return (
    <>
      <Header />
      <div className="container">
        <div className="wraper">
          <h2>Welcome to Chat App</h2>
          {showSuccessMessage && (
            <div className="green msgs">User Signed Up Successfully</div>
          )}
          {serverError && <div className="red msgs">{serverError}</div>}
          {errors.name && <div className="red msgs">{errors.name.message}</div>}
          {errors.email && (
            <div className="red msgs">{errors.email.message}</div>
          )}
          {errors.password && (
            <div className="red msgs">{errors.password.message}</div>
          )}
          <form action="" onSubmit={handleSubmit(onsubmit)}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              {...register("name", {
                required: { value: true, message: "Please Enter Name" },
              })}
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              {...register("email", {
                required: { value: true, message: "Please Enter Email" },
              })}
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              {...register("password", {
                required: { value: true, message: "Please Enter Password" },
              })}
            />

            <label htmlFor="profile_pic">Photo:</label>
            <div className="custom-file-input">
              <input type="file" onChange={handleFileChange} id="profile_pic" />
              {fileName ? (
                <div className="file-info">
                  <span className="file-name profie-text">{fileName}</span>
                  <span className="remove-file" onClick={handleRemoveFile}>
                    &times;
                  </span>
                </div>
              ) : (
                <span className="profie-text">Upload Profile Photo</span>
              )}
            </div>

            <button type="submit">
              Register
              {isLoading && <i className="fa-solid fa-spinner fa-spin"></i>}
            </button>

            <p>
              Already have account?{" "}
              <NavLink to="/checkemailpage">Login</NavLink>{" "}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
