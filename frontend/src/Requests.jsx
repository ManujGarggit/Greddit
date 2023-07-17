import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactModal from "react-modal"
import { useNavigate } from "react-router-dom";
import "./Requests.css"

function Requests() {
    const navigate = useNavigate();
    const CurrUrl = document.URL;
    const dummy = CurrUrl.split("/");
    const Name = dummy[4];
    const [Requested, setRequested] = useState([]);
    const tok = localStorage.getItem('token');
    const [Yes,setYes] = useState(1)

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
                setRequested(response.data.Requested);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    if(Yes===-1){
        navigate("/profile");
    }

    console.log(Requested);
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
            <h3 style={{ color: "red", marginLeft: "750px", marginTop: "20px", display: "block" }}>REQUESTED USERS</h3>
            {
                Requested.map(item => {
                    return (
                        <div className="note" style={{ width: "300px" }}>
                            <h1 style={{ color: "red" }} >Name</h1>
                            <input type="text" style={{ color: "blue" ,width:"250px"}} disabled value={item.Name}></input>
                            <p style={{ color: "red" }}>Email</p>
                            <input type="text" style={{ width: "250px", color: "blue" }} disabled value={item.Email}></input>
                            <button style={{marginLeft:"10px",backgroundColor:"green",color:"white",marginTop:"15px",borderRadius:"10px",marginLeft:"20px"}} onClick={()=>{
                                // here remove the user from requested array and insert into join array
                                axios.post("/api/profile/Requests/Accept",{NameG:Name,Name:item.Name,accessToken: tok })
                                .then(response=>{
                                    const newArr = Requested.filter(value=>{return value.Name!=item.Name});
                                    setRequested(newArr);
                                })
                                .catch(error=>{
                                    console.log(error);
                                })
                            }}>ACCEPT</button>
                            <button style={{marginLeft:"10px",backgroundColor:"red",color:"white",borderRadius:"10px",marginLeft:"50px"}} onClick={()=>{
                                axios.post("/api/profile/Requests/Reject",{NameG:Name,Name:item.Name,Email:item.Email,accessToken: tok })
                                .then(response=>{
                                    const newArr = Requested.filter(value=>{return value.Name!=item.Name});
                                    setRequested(newArr);
                                })
                                .catch(error=>{
                                    console.log(error);
                                })
                            }}>REJECT</button>
                        </div>
                    )
                })
            }
        </div>
    )

}

export default Requests;