import React, {useState} from "react";
import Header from "../../Header";
import "./register.css";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
  const [fileName, setFileName] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onsubmit = async (data) => {
    console.log(data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "");
    setValue("photo", file);
  };

  const handleRemoveFile = () => {
    console.log("hello")
    setFileName("");
    setValue("photo", null);
    document.getElementById("photo").value = "";
  };
  return (
    <>
      <Header />
      <div className="container">
        <div className="wraper">
          <h2>Welcome to Chat App</h2>
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

            <label htmlFor="photo">Photo:</label>
            <div className="custom-file-input">
              <input
                type="file"
                id="photo"
                {...register("photo")}
                onChange={handleFileChange}
              />
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

            <button type="submit">Register</button>

            <p>Already have account? Login</p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
