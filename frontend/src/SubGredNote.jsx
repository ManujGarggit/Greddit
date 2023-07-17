import React, { useEffect, useState } from "react";
import "./Requests.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Routes, Route, useNavigate } from "react-router-dom";

function NoteSub(props) {
    const navigate = useNavigate();
    const Joined = props.Joined;
    const Mod = props.Mod;
    let toggle = Joined.indexOf(props.Name);
    if(toggle===-1) toggle=0;
    else toggle = 1;

    let toggleM = Mod.indexOf(props.Name);
    if(toggleM===-1) toggleM=0;
    else toggleM = 1;

    const Blocked = props.Blocked;
    const UserName = props.User;
    let toggleB = Blocked.indexOf(UserName);
    if(toggleB===-1) toggleB=0;
    else toggleB = 1;

    let ToDisplayKey="";
    if(props.Key && props.Key.length) ToDisplayKey = props.Key.join(",");
    let ToDisplayTag="";
    if(props.Tag && props.Tag.length) ToDisplayTag = props.Tag.join(",");
    return (
        <div className="note" style={{ width: "300px" }}>
            <button style={{position:"relative",float:"right",height:"30px",marginRight:"20px",backgroundColor:toggle?"yellow":"white",border:"none"}}>
                <VisibilityIcon  style={{margin:"0px",padding:"0px",backgroundColor:toggle?"yellow":"white",visibility:toggle?"visible":"hidden"}}  onClick={()=>{
                   navigate("/profile/SubGred/"+props.Name)
                }} /> 
            </button>
            <p style={{color:"red"}}>{"People : " + props.Number}</p>
            <p style={{color:"red"}}>{"Posts : " + props.NumberP}</p>
            <p style={{color:"red"}}>{"Name : " + props.Name}</p>
            <h1 style={{ display: "inline" ,color:"red"}} >Description</h1>
            <textarea rows={3} type="text"  style={{color:"blue"}} disabled value={props.Description}></textarea>
            <p style={{color:"red"}}>Banned Keywords</p>
            <input type="text" style={{ display: "inline", width: "270px",color:"blue" }} disabled value={ToDisplayKey}></input>
            <p style={{color:"red"}}>Tags</p>
            <input type="text" style={{ display: "inline", width: "270px",color:"blue" }} disabled value={ToDisplayTag}></input>
            <button style={{backgroundColor:toggleM||toggleB?"grey":"black",color:"white",borderRadius:"10px",marginTop:"10px",marginLeft:"100px"}} onClick={()=>{
                if(toggle==1) props.Leave(props.Name);
                else props.Join(props.Name);
            }} disabled={toggleM || toggleB}>{toggle?"LEAVE":"JOIN"}</button>
        </div>
    )
}

export default NoteSub;