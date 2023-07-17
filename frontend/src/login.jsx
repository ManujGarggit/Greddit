import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Protected from "./Protected";
import Profile from "./Profile";
import axios from "axios";
import "./Login.css";

function Login(props) {
  const navigate = useNavigate();
  const [count, setCount] = useState(0); // if the useState is 2 then change in u1
  const [content, setContent] = useState({
    UserName: "",
    Password: ""
  });

  function handleChange(event) {
    const triggered = event.target.name;
    const newValue = event.target.value;
    let prevValue = "";
    if (triggered === "UserName") {
      prevValue = content.UserName;
    }
    else if (triggered === "Password") {
      prevValue = content.Password;
    }
    if (prevValue.length === 0 && newValue.length > 0) {
      setCount((c) => { return c + 1 });
    }
    else if (prevValue.length > 0 && newValue.length === 0) {
      setCount((c) => { return c - 1 });
    }
    setContent((prevValue) => {
      return {
        ...prevValue,
        [triggered]: newValue,
      }
    })
  }

  return (
    <div className="center">
      <button name="Login" type="button" className="buttonLogReg" style={{ backgroundColor: "yellow" }} onClick={() => {
        props.OnClick("Login");
      }}>
        Login
      </button>
      <button name="Register" type="button" className="buttonLogReg" style={{ backgroundColor: "white", marginLeft: "180px" }} onClick={() => {
        props.OnClick("Register");
      }}>
        Register
      </button>
      <h1>Sign In</h1>
      <form onSubmit={(e)=>{
        e.preventDefault();
        axios.post("/api/login",{UserName:content.UserName,Password:content.Password})
        .then(response=>{
          console.log(response.data);
          if(response.data===0){
            alert("The username or password is incorrect!!!");
            window.location.reload();
          }
          else{
            localStorage.setItem("token",response.data.accessToken);
            navigate("/profile");
          }
        })
        .catch(error=>{
          console.log(error);
        })
      }}>
        <input
          required
          type="text"
          placeholder="UserName"
          name="UserName"
          className="text"
          onChange={handleChange}
          value={content.UserName}
        />
        <input
          required
          type="text"
          placeholder="Password"
          name="Password"
          className="text"
          onChange={handleChange}
          value={content.Password}
        />
        <button type="submit" name="Submit" style={{ backgroundColor: count == 2 ? "yellow" : "white" }} className="button" disabled={count<2}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
