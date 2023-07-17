import React, { useState } from "react";
import Login from "./login";
import Register from "./register";
import Top from "./Top"
import "./Login.css";

function First() {
  document.body.style.background = "linear-gradient(120deg, #2980b9, #8e44ad)";
  const [logreg, setLogreg] = useState(0); // 0 for register , 1 for login
  function handleClick(triggered) {
    if (triggered === "Login") {
      setLogreg(1);
    } else {
      setLogreg(0);
    }
  }


  return (
    <div>
        <Top />
      {logreg ? (
        <div>
          <Login OnClick={handleClick} />
        </div>
      ) : (
        <div>
          <Register OnClick={handleClick} />
        </div>
      )}
    </div>
  );
}

export default First;
