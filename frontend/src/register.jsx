import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Register(props) {
  document.body.style.background = "linear-gradient(120deg, #2980b9, #8e44ad)";
  const [count, setCount] = useState(0); // if the useState is 2 then change in u1
  const [content, setContent] = useState({
    FirstName: "",
    LastName: "",
    UserName: "",
    Password: "",
    EmailId: "",
    Age: "",
    ContactNumber: ""
  });

  const [e,setE] = useState(0);
  const [a,setA] = useState(0);
  const [p,setP] = useState(0);

  function handleChange(event) {
    const triggered = event.target.name;
    const newValue = event.target.value;
    let prevValue = "";
    setContent((prevValue) => {
      return {
        ...prevValue,
        [triggered]: newValue,
      }
    })
    if (triggered === "FirstName") {
      prevValue = content.FirstName;
      if (prevValue.length === 0 && newValue.length > 0) {
        setCount((c) => { return c + 1 });
      }
      else if (prevValue.length > 0 && newValue.length === 0) {
        setCount((c) => { return c - 1 });
      }
    }
    else if (triggered === "LastName") {
      prevValue = content.LastName;
      if (prevValue.length === 0 && newValue.length > 0) {
        setCount((c) => { return c + 1 });
      }
      else if (prevValue.length > 0 && newValue.length === 0) {
        setCount((c) => { return c - 1 });
      }
    }
    else if (triggered === "UserName") {
      prevValue = content.UserName;
      if (prevValue.length === 0 && newValue.length > 0) {
        setCount((c) => { return c + 1 });
      }
      else if (prevValue.length > 0 && newValue.length === 0) {
        setCount((c) => { return c - 1 });
      }
    } else if (triggered === "Password") {
      prevValue = content.Password;
      if (prevValue.length === 0 && newValue.length > 0) {
        setCount((c) => { return c + 1 });
      }
      else if (prevValue.length > 0 && newValue.length === 0) {
        setCount((c) => { return c - 1 });
      }
    } else if (triggered === "EmailId") {
      if(newValue.length===0) setE(0);
      else{
        let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(res.test(newValue)===true) setE(1);
        else {
          setE(0);
        }
      }
    } 
    else if (triggered === "Age") {
      if(newValue.length===0) setA(0);
      else{
        const temp = isNaN(newValue);
        if(temp===false){
          if(newValue>=8 && newValue<=100) setA(1);
          else {
            setA(0);
          }
        }
        else setA(0);
      }
    } else if (triggered === "ContactNumber") {
      if(newValue.length===0) setP(0);
      else{
        const temp = isNaN(newValue);
        if(temp===false){
          if(newValue.length===10) setP(1);
          else {
            setP(0);
          }
        }
        else setP(0);
      }
    }
  }

  return (
    <div className="center">
      <button name="Login" className="buttonLogReg" style={{ backgroundColor: "white" }} onClick={() => {
        props.OnClick("Login");
      }}>
        Login
      </button>
      <button name="Register" className="buttonLogReg" style={{ backgroundColor: "yellow", marginLeft: "180px" }} onClick={() => {
        props.OnClick("Register");
      }}>Register</button>
      <h1>Sign Up</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        axios.post("/api/register", { FirstName: content.FirstName, LastName: content.LastName, UserName: content.UserName, Age: content.Age, EmailId: content.EmailId, Password: content.Password, Contact: content.ContactNumber })
          .then(response => {
            console.log(response.data);
            if (response.data == 0) {
              alert("A user already exists with same username");
              window.location.reload();
            }
            else if(response.data===2){
              alert("Please follow the input format!!!");
              window.location.reload();
            }
            else {
              props.OnClick("Login");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }}>
        <input className="text" required type="text" placeholder="FirstName" name="FirstName" onChange={handleChange} value={content.FirstName} />
        <input className="text" required type="text" placeholder="LastName" name="LastName" onChange={handleChange} value={content.LastName} />
        <input className="text" required type="text" placeholder="UserName" name="UserName" onChange={handleChange} value={content.UserName} />
        <input className="text" required type="email" placeholder="EmailId" name="EmailId" onChange={handleChange} value={content.EmailId} />
        <input className="text" required type="text" min="8" max="100"  placeholder="Age" name="Age" onChange={handleChange} value={content.Age} />
        <input className="text" required type="text"  pattern="[789][0-9]{9}" placeholder="ContactNumber" name="ContactNumber" onChange={handleChange} value={content.ContactNumber} />
        <input className="text" required type="Password" placeholder="Password" name="Password" onChange={handleChange} value={content.Password} />
        <button name="Submit" type="submit" class="button" style={{ backgroundColor: ((count === 4) && e && a && p) ? "yellow" : "white" }} disabled={((count === 4) && e && a && p)?false:true}>
          Register
        </button>
      </form>
    </div>
  )
}

export default Register;