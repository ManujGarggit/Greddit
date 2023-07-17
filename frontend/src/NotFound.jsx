import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotFound(){
    const navigate = useNavigate();
    const islogged = localStorage.getItem("token");
    return (
        <div>
            <p style={{fontSize:"100px" ,color:"red",textAlign:"center"}}>404 PAGE NOT FOUND</p>
            {islogged 
            ?
            (
                <div>
                    <p style={{fontSize:"30px",color:"blue",textAlign:"center"}}>GO BACK TO PROFILE PAGE</p>
                    <button style={{marginLeft:"850px",backgroundColor:"yellow",borderRadius:"10px"}} onClick={()=>{
                        navigate("/profile");
                    }}>PROFILE</button>
                </div>
            )
            :
            (
                <div>
                    <p style={{fontSize:"30px",color:"blue",textAlign:"center"}}>GO BACK TO LOGIN PAGE</p>
                    <button style={{marginLeft:"850px",backgroundColor:"yellow",borderRadius:"10px"}} onClick={()=>{
                        navigate("/login");
                    }}>LOGIN</button>
                </div>
            )
            }
        </div>
    )
}

export default NotFound;