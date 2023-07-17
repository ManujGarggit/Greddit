import React, { useEffect, useState } from "react";
import "./Requests.css"
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Note(props) {
    let ToDisplayKey="";
    if(props.Key && props.Key.length) ToDisplayKey = props.Key.join(",");
    let ToDisplayTag="";
    if(props.Tag && props.Tag.length) ToDisplayTag = props.Tag.join(",");
    return (
        <div className="note" style={{ width: "300px" }}>
            <button style={{position:"relative",float:"right",border:"none",width:"40px",backgroundColor:"yellow"}}>
                <DeleteIcon style={{position:"relative",float:"right",display:"block",backgroundColor:"yellow",marginLeft:"5px"}} onClick={()=>{props.onDelete(props.Name)}}/>
            </button>
            <button style={{position:"relative",float:"right",height:"30px",marginRight:"20px",backgroundColor:"yellow",border:"none"}}>
                <VisibilityIcon  style={{margin:"0px",padding:"0px",backgroundColor:"yellow"}}  onClick={()=>{props.onOpen(props.Name)}} /> 
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
        </div>
    )
}

export default Note;