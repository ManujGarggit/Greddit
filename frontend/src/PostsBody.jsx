import React, { useEffect, useState } from "react";
import "./Posts.css"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import ReactModal from "react-modal"

function PostBody(props){
    const tok = localStorage.getItem('token');
    const [Comment,setComment] = useState(props.Comment);
    const [NewComment,setNewComment] = useState("");
    const UserName = props.CurrUser;
    const ID = props.ID;
    const [UpVoted,setUpVoted] = useState(props.UpVoted);
    const [DownVoted,setDownVoted] = useState(props.DownVoted);
    var temp1 = UpVoted.indexOf(UserName);
    var temp2 = DownVoted.indexOf(UserName);
    const [Tog,setTog] = useState(0);
    const [TogM,setTogM] = useState(0);
    const [content,setContent] = useState("");
    if(temp1===-1) temp1=0;
    else temp1=1;
    if(temp2===-1) temp2=0;
    else temp2=1;
    return(
        <div style={{padding:"10px"}}>
            <p style={{fontSize:"30px",marginLeft:"140px",color:"red",display:"inline"}}>Posted By : </p>
            <input style={{color:"blue",padding:"5px",border:"2px solid black",width:"235px"}} value={props.PostedBy} type="text" disabled></input>
            <button style={{backgroundColor:"#f5f5f5",border:"none"}} disabled={props.PostedBy=="Blocked User"}><BookmarkIcon  onClick={()=>{props.Follow(props.PostedBy)}} style={{color:"royalblue",visibility:props.PostedBy==="Blocked User"?"hidden":"visible"}}/></button>
            <p  style={{fontSize:"30px",marginLeft:"50px",color:"red",display:"inline"}}>Posted In : </p>
            <input style={{color:"blue",padding:"5px",border:"2px solid black",width:"235px"}}  value={props.PostedIn} type="text" disabled></input>
            <button style={{backgroundColor:"#f5f5f5",border:"none"}} disabled={temp1}>
            <ThumbUpIcon style={{marginLeft:"30px",color:"green",visibility:temp1?"hidden":"visible"}} onClick={()=>{
                    props.Up({ID:ID})
                    const FUP = UpVoted;
                    FUP.push(UserName);
                    console.log(FUP);
                    setUpVoted(FUP);
                    const FDP = DownVoted.filter((value)=>{return value!=UserName});
                    setDownVoted(FDP);
                }
            } />
            </button>
            <button style={{backgroundColor:"#f5f5f5",border:"none"}} disabled={temp2}>
            <ThumbDownIcon  style={{marginLeft:"15px",color:"red",visibility:temp2?"hidden":"visible"}} onClick={()=>{
                    props.Down({ID:ID})
                    const FDP = DownVoted;
                    FDP.push(UserName);
                    console.log(FDP);
                    setDownVoted(FDP);
                    const FUP = UpVoted.filter((value)=>{return value!=UserName});
                    setUpVoted(FUP);
                }
            } />
            </button>
            <p style={{fontSize:"30px",marginLeft:"140px",color:"red",marginTop:"12px"}}>Description</p>
            <textarea rows={4} style={{marginLeft:"140px",border:"2px solid black",padding:"5px",width:"856px",color:"blue"}} value={props.Description} type="text" disabled></textarea>
            <button style={{backgroundColor:"yellow",color:"black",borderRadius:"10px",marginLeft:"40px"}} onClick={()=>{
                if(TogM===0) setTogM(1);
                else setTogM(0);
            }}>REPORT</button>
            <button style={{backgroundColor:"yellow",color:"black",borderRadius:"10px",marginLeft:"20px",width:"80px"}}  onClick={()=>{props.Save({ID:ID})}}>SAVE</button>
            <p style={{fontSize:"30px",marginLeft:"140px",color:"red",marginTop:"12px" ,width:"200px" }} onClick={()=>{
                if(Tog===0) setTog(1);
                else setTog(0);
            }}>Comments</p>
            <ReactModal isOpen={TogM} style={{overlay:{width:"1400px",height:"800px",marginLeft:"170px",marginTop:"100px",border:"2px solid blue",opacity:"90%"}}}>
                <p style={{fontSize:"30px",marginLeft:"570px"}}>CONTENT</p>
                <textarea type="text" rows={3}  value={content} onChange={(e)=>setContent(e.target.value)} style={{marginLeft:"390px",width:"500px",border:"3px solid red",display:"inline"}}></textarea>
                <button style={{backgroundColor:"yellow",color:"black",marginTop:"460px",marginLeft:"1180px",borderRadius:"10px"}} onClick={()=>{
                    axios.post("/api/profile/AddReport",{NameG:props.PostedIn,accessToken:tok,RepUser:props.PostedBy,Content:content,Text:props.Description,id:ID})
                    .then(response => {
                        console.log(response.data);
                        if(response.data===2){
                            alert("You can't report a post made by yourself!!!");
                        }
                        else if(response.data===3){
                            alert("You can't report a moderator of the post!!!");
                        }
                        setTogM(0);
                        setContent("");
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }}>SUBMIT</button>
            </ReactModal>
            <input value={NewComment} type="text" style={{marginLeft:"310px",color:"blue",width:"500px"}} onChange={(e)=>{setNewComment(e.target.value)}}></input>
            <AddIcon style={{marginLeft:"30px",color:"black"}} onClick={()=>{
                if(NewComment.length){
                    setComment((prevValue)=>{
                        return [...prevValue,NewComment];
                    })
                    setNewComment("");
                    props.SaveComment({ID:ID,Description:NewComment});
                }
            }}/>
            <div className="bodyScroll" style={{overflowX:"auto" ,width:"856px",marginLeft:"140px",overflowY:"auto",height:Tog?"120px":"50px",marginTop:"20px"}}>
                {
                    Comment.map((item)=>{
                        return (   
                            <ul>
                                <li style={{color:"blue"}}>{item}</li>
                            </ul>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default PostBody;