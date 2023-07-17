import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Saved() {
    const navigate = useNavigate();
    const [Saved, setSaved] = useState([]);
    const tok = localStorage.getItem('token');

    useEffect(() => {
        axios.post("/api/profile/GetSavedPosts", { accessToken: tok })
            .then(response => {
                const Coming = response.data.Posts;
                var NewArr = [];
                Coming.map((item)=>{
                    const Given = item;
                    NewArr.push(Given[0]);
                })
                console.log(NewArr);
                setSaved(NewArr);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);


    document.body.style.overflowY = "auto";

    function handleUnsave(props){
        axios.post("/api/profile/UnSavePost",{accessToken:tok,GredName:props.Greddit,PostId:props.Id})
        .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.log(error);
          });
    }


        return (
            <div className="Saved">
                <header style={{ backgroundColor: "royalblue", height: "70px" }}>
                    <div>
                        <h1 style={{ color: "white", display: "inline", marginLeft: "10px" }}>
                            MY SAVED POSTS
                        </h1>
                        <button style={{ position: "absolute", marginLeft: "1210px", marginTop: "20px", backgroundColor: "royalblue", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                            navigate("/profile");
                        }}>PROFILE</button>
                        <button style={{ position: "absolute", marginLeft: "1310px", marginTop: "20px", backgroundColor: "royalblue", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                            localStorage.removeItem('token');
                            navigate("/login");
                        }}>LOGOUT</button>
                    </div>
                </header>
                <br>
                </br>
                <br></br>
                {
                    Saved.map(item => {
                        return (
                            <div style={{marginLeft:"360px"}}>
                                <p style={{ fontSize: "30px", marginLeft: "140px", color: "red", display: "inline" }}>Posted By : </p>
                                <input style={{ color: "blue", padding: "5px", border: "2px solid black", width: "235px" }} value={item.PostedBy} type="text" disabled></input>
                                <p style={{ fontSize: "30px", marginLeft: "50px", color: "red", display: "inline" }}>Posted In : </p>
                                <input style={{ color: "blue", padding: "5px", border: "2px solid black", width: "235px" }} value={item.Greddit } type="text" disabled></input>
                                <p style={{ fontSize: "30px", marginLeft: "140px", color: "red", marginTop: "12px" }}>Description</p>
                                <textarea rows={4} style={{ marginLeft: "140px", border: "2px solid black", padding: "5px", width: "856px", color: "blue" }} value={item.Description} type="text" disabled></textarea>
                                <button style={{backgroundColor:"yellow",color:"black",borderRadius:"10px",marginLeft:"40px"}} onClick={()=>{
                                    const NewArr = Saved.filter((value)=>{return value.id!=item.id});
                                    setSaved(NewArr);
                                    handleUnsave({Greddit:item.Greddit,Id:item.id});
                                }}>UNSAVE</button>
                                <p style={{ fontSize: "30px", marginLeft: "140px", color: "red", marginTop: "12px" }}>Comments</p>
                                <div className="bodyScroll" style={{ overflowX:"auto" ,width:"856px",marginLeft:"140px",overflowY:"auto",height:"120px",marginTop:"20px"}}>
                                    {
                                        item.Comment.map((item) => {
                                            return (
                                                <ul>
                                                    <li style={{ color: "blue", padding: "2px" }}>{item}</li>
                                                </ul>
                                            )
                                        })
                                    }
                                </div>
                                <br></br>
                            </div>
                        )
                    })
                }
            </div>
        )
}       

export default Saved;