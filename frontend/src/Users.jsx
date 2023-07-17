import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Requests.css"

function Users() {
    const navigate = useNavigate();
    const tok = localStorage.getItem('token');
    const [Joined, setJoined] = useState([]);
    const [Blocked, setBlocked] = useState([]);
    const [Yes,setYes] = useState(1)
    const CurrUrl = document.URL;
    const dummy = CurrUrl.split("/");
    const Name = dummy[4];

    useEffect(() => {
        axios.post("/api/profile/GetAGredditWithName",{accessToken:tok,Name:Name})
        .then(response=>{
            console.log(response.data);
            const Mod = response.data.Mod
            const User = response.data.UserName
            const temp1 = Mod.indexOf(User)
            setYes(temp1)
        })
        .catch(error=>{
            console.log(error)
        })
        axios.post("/api/profile/GetAGreddit", { Name: Name ,accessToken: tok })
            .then(response => {
                setJoined(response.data.Joined);
                setBlocked(response.data.Blocked);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    // here we have to display the information also 
    if(Yes===-1){
        navigate("/profile");
    }

    return (
        <div>
            <header style={{ backgroundColor: "royalblue", height: "70px" }}>
                <div>
                    <h1 style={{ color: "white", display: "inline", marginLeft: "10px" }}>
                        MY SUB GREDDIT
                    </h1>
                    <button style={{ marginLeft: "1200px", backgroundColor: "royalblue", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                        navigate("/profile/MySubGred");
                    }}>MySubGreddit</button>
                </div>
            </header>
            <div>
                {Joined.map((item) => {
                    return (
                        <div className="note" style={{ width: "300px" }}>
                            <p style={{ color: "green", marginLeft: "100px", fontSize: "25px" }}><strong>JOINED</strong></p>
                            <h1 style={{ color: "red" }} >Name</h1>
                            <input type="text" style={{ color: "blue", width: "250px" }} disabled value={item}></input>
                        </div>
                    )
                })}
            </div>
            <div>
                {Blocked.map((item) => {
                    return (
                        <div className="note" style={{ width: "300px" }}>
                            <p style={{ color: "green", marginLeft: "100px", fontSize: "25px" }}><strong>BLOCKED</strong></p>
                            <h1 style={{ color: "red" }} >Name</h1>
                            <input type="text" style={{ color: "blue", width: "250px" }} disabled value={item}></input>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Users;
