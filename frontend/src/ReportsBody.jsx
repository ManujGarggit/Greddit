import React, { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import "./Requests.css"

function ReportsBody(props) {
    console.log("rudransh")
    const [Show,setShow] = useState(props.state);
    const [Counter,setCounter] = useState(Show===2?-1:3);
    const [INT,setINT] = useState("");
    const tok = localStorage.getItem('token');
    if(Counter===0) clearInterval(INT);
    return (
        <div>
            <div className="note" style={{ width: "400px" }}>
                <p style={{ color: "red" }}>ReportedBy :  {props.ReportedBy}</p>
                <p style={{ color: "red" }}>ReportedUser :  {props.ReportedUser}</p>
                <p style={{ color: "red" }}>Concern</p>
                <textarea style={{ color: "blue", border: "2px solid black", width: "350px" }} rows={3} value={props.Concern} disabled></textarea>
                <p style={{ color: "red" }}>Text</p>
                <input style={{ color: "blue", border: "2px solid black", width: "350px" }} value={props.Text} disabled></input>
                <br></br>
                <br></br>
                <button className="ignoreButton" id={"a"+props.ID} onClick={()=>{
                    axios.post("/api/profile/Ignore",{NameG:props.NameG,id:props.ID,ignore:Show,accessToken: tok })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    if(Show===0) setShow(1);
                    else if(Show===1) setShow(0);
                }} disabled={Show===2} style={{ backgroundColor: "yellow", color: "black", borderRadius: "10px", marginTop: "10px", height: "40px", marginLeft: "30px" }}>IGNORE</button>
                <button  className="blockButton" id={"a"+props.ID} onClick={()=>{
                    if(Show===2){
                        if(Counter>0){
                            document.querySelector(".blockButton#a"+props.ID).innerHTML="BLOCK";
                            document.querySelector(".ignoreButton#a"+props.ID).style.marginLeft="30px";
                            clearInterval(INT);
                            setShow(0);
                            setCounter(3);
                        }
                    }
                    else if(Show!==2){
                        document.querySelector(".blockButton#a"+props.ID).innerHTML="Cancel In 3 s";
                        document.querySelector(".ignoreButton#a"+props.ID).style.marginLeft="15px";
                        let counter = Counter;
                        setINT(setInterval(() => {
                            counter--;
                            setCounter(counter); 
                            if(counter>0){
                                document.querySelector(".blockButton#a"+props.ID).innerHTML="Cancel In " + counter + "s";
                                document.querySelector(".ignoreButton#a"+props.ID).style.marginLeft="16px";   
                            }                    
                          if (counter === 0 ) {
                            axios.post("/api/profile/BlockUser",{NameG:props.NameG,id:props.ID,NameU:props.ReportedUser,accessToken:tok}) // pull from the joined/follower and push to blocked 
                                .then(response => {
                                    console.log(response.data);
                                    if(response.data===0){
                                        alert("You can't block the moderator!!!");
                                    }
                                    else if(response.data===4){
                                        alert("You have already blocked this user for the subgreddit!!!");
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                }) 
                            document.querySelector(".blockButton#a"+props.ID).innerHTML="BLOCKED";
                            document.querySelector(".blockButton#a"+props.ID).style.color="red";
                            document.querySelector(".ignoreButton#a"+props.ID).style.marginLeft="20px";
                          }
                        }, 1000));
                        setShow(2);
                    }
                }} disabled={Show===1} style={{ backgroundColor: "yellow", color:Counter===-1?"red":"black", borderRadius: "10px", marginTop: "10px", marginLeft: "20px", height: "40px" }}>{Counter===-1?"BLOCKED":"BLOCK"}</button>
                <button onClick={()=>{
                    props.Delete(props.ID);
                }} disabled={Show===1} style={{ backgroundColor: "yellow", color: "black", borderRadius: "10px", marginTop: "10px", marginLeft: "20px", height: "40px" }}>DELETE</button>
            </div>
        </div>
    )
}

export default ReportsBody;