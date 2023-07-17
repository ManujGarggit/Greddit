import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img1 from "./img1.jpg"
import ReactModal from "react-modal"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import "./Posts.css"
import PostBody from "./PostsBody";

function Posts() {
    const navigate = useNavigate();
    const CurrUrl = document.URL;
    const dummy = CurrUrl.split("/");
    const Name = dummy[5]; // name of the subgreddit 
    const [Description,setDescription] = useState("");
    const [content, setContent] = useState("");
    const [Keyword,setKeyword] = useState([]);
    const [Tog,setTog] = useState(0);
    const [Post,setPost] = useState([]);
    const tok = localStorage.getItem('token');
    const [UserName,setUserName] =  useState(""); // name of the user logged in
    const [len,setLen] = useState(0);
    const [Yes,setYes] = useState(1)

    useEffect(() => {
        axios.post("/api/profile/GetAGredditWithNameJoin",{accessToken:tok,Name:Name})
        .then(response=>{
            console.log(response.data);
            const Join = response.data.Joined
            const User = response.data.UserName
            const temp1 = Join.indexOf(User)
            setYes(temp1)
        })
        .catch(error=>{
            console.log(error)
        })
        axios.post("/api/GetUser", { accessToken: tok })
            .then(response => {
                setUserName(response.data.User);
            })
            .catch(error => {
                console.log(error);
            })
        axios.post("/api/profile/GetGred",{NameG:Name,accessToken: tok })
        .then(response=>{
            setDescription(response.data.Description);
            setLen(response.data.Post.length);
            setKeyword(response.data.Key);
        })
        axios.post("/api/profile/GetPosts",{NameG:Name,accessToken:tok})
        .then(response=>{
            setPost(response.data);
        })
        .catch(error=>{
            console.log(error);
        })
    }, []);

    if(Yes===-1){
        navigate("/profile");
    }

    document.body.style.background = "#f5f5f5";
    document.body.style.overflowY = "hidden";

    function handleUp(props){
        const Id = props.ID;
        axios.post("/api/profile/Up", { Id:Id ,Gred:Name,CurrUser:UserName,accessToken: tok })
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error);
        })
    }

    function handleDown(props){
        const Id = props.ID;
        axios.post("/api/profile/Down", {Id:Id ,Gred:Name,CurrUser:UserName,accessToken: tok })
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error);
        })
    }

    function handleFollow(Name){
        axios.post("/api/profile/Follow", { UserToFollow:Name,Follower:UserName,accessToken: tok })
        .then(response => {
            console.log(response.data);
            if(response.data===4){
                alert("You can't follow yourself");
            }
            else if(response.data===2){
                alert("You have already followed the user");
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    function handleSave(props){
        const ID = props.ID;
        axios.post("/api/profile/Save",{accessToken:tok,Id:ID,Greddit:Name,accessToken: tok })
        .then(response => {
            console.log(response.data);
            if(response.data===2){
                alert("You have already saved the post");
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    function handleSaveComment(props){
        const Des = props.Description;
        const Id = props.ID;
        axios.post("/api/profile/SaveComment",{Id:Id,Greddit:Name,Des:Des,accessToken: tok })
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error);
        })
    }

    
        return (
            <div style={{width:"550px",position:"absolute",height:"829px"}}>
                <header style={{ backgroundColor: "royalblue", height: "70px" ,width:"2000px"}}>
                    <div>
                        <h1 style={{ color: "white", display: "inline", marginLeft: "10px" }}>
                            SUB GREDDIT
                        </h1>
                        <button style={{ position: "absolute", marginLeft: "1150px", backgroundColor: "royalblue", marginTop: "20px", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                            navigate("/profile/SubGred");
                        }}>SUBGREDDIT</button>
                        <button style={{ position: "absolute", marginLeft: "1290px", marginTop: "20px", backgroundColor: "royalblue", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                            navigate("/profile");
                        }}>PROFILE</button>
                        <button style={{ position: "absolute", marginLeft: "1380px", marginTop: "20px", backgroundColor: "royalblue", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                            localStorage.removeItem('token');
                            navigate("/login");
                        }}>LOGOUT</button>
                    </div>
                </header>
                <div  className="stick" >
                    <img src={img1} alt="image not there" style={{ width: "400px", height: "400px", position: "absolute", marginLeft: "100px", borderRadius: "50%", marginTop: "40px", display: "inline" ,border:"7px solid yellow"}}></img>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <p style={{ position: "relative", float: "left", fontSize: "30px", color: "red", display: "inline", marginLeft: "100px" }}>Name : </p>
                    <input style={{ display: "inline", marginLeft: "10px", marginTop: "6px", color: "blue", borderColor: "black" }} disabled value={Name}></input>
                    <p style={{ marginLeft: "100px", fontSize: "30px", color: "red", position: "absolute", marginTop: "10px" }}>Description</p>
                    <br></br>
                    <br></br>
                    <br></br>
                    <textarea rows={5} style={{ border: "2px solid black", display: "inline", marginLeft: "100px", width: "413px", marginTop: "10px", color: "blue" }} disabled value={Description}></textarea>
                </div>
                <button style={{marginLeft:"1210px",marginTop:"10px",border:"none",backgroundColor:"#f5f5f5",position:"absolute"}}>
                        <AddCircleOutlineOutlinedIcon  style={{color:"blue"}} onClick={()=>{
                            if(Tog===0) setTog(1);
                            else setTog(0);
                        }} fontSize="large" color="success"/>
                    </button>
                <div className="scroll">
                    <ReactModal isOpen={Tog} style={{overlay:{width:"1600px",height:"800px",marginLeft:"100px",marginTop:"100px",border:"2px solid blue",opacity:"90%"}}}>
                        <p style={{fontSize:"30px",marginLeft:"640px"}}>CONTENT</p>
                        <textarea type="text" rows={3}  value={content} onChange={(e)=>setContent(e.target.value)} style={{marginLeft:"490px",width:"500px",border:"3px solid red",display:"inline"}}></textarea>
                        <button style={{backgroundColor:"yellow",color:"black",marginTop:"460px",marginLeft:"1380px",borderRadius:"10px"}} onClick={()=>{
                            var ID = len;
                            ID = ID + 1;
                            const Arr = content.split(" ");
                            var ToPostArr = [];
                            const lowercaseWords = Keyword.map(word => word.toLowerCase());
                            var flag=0;
                            Arr.map((item)=>{
                                const itemN = item.toLowerCase();
                                const temp1 = lowercaseWords.indexOf(itemN);
                                if(temp1>=0){
                                    flag=1;
                                    ToPostArr.push("*");
                                }
                                else ToPostArr.push(item);
                            })
                            if(flag===1){
                                alert("Your post have some banned keywords!!!");
                            }
                            const NewContent = ToPostArr.join(" ");
                            if(content.length){
                                axios.post("/api/profile/PostGred",{NameG:Name,Content:NewContent,CurrUser:UserName,len:len,Key:Keyword,accessToken: tok })
                                    .then(response=>{
                                        console.log(response.data);
                                        Post.push({
                                            UpVoted:[],
                                            DownVoted:[],
                                            Description:NewContent,
                                            Greddit:Name,
                                            PostedBy:UserName,
                                            Comment:[],
                                            id:ID
                                        })
                                        setTog(0);
                                    })
                                    .catch(error=>{
                                        console.log(error);
                                    })
                                setLen(len+1);
                                setContent("");
                            }
                        }}>SUBMIT</button>
                    </ReactModal>
                    {Post.map((item)=>{
                        return(
                            <div>
                                <PostBody  SaveComment={handleSaveComment} Save={handleSave} Follow={handleFollow} ID={item.id} Up={handleUp} Down={handleDown} Greddit={item.Greddit} UpVoted={item.UpVoted} DownVoted={item.DownVoted} PostedBy={item.PostedBy} PostedIn={Name} Comment={item.Comment} Description={item.Description} CurrUser={UserName} Comments={item.Comment}/>
                                <br></br>
                                <br></br>
                            </div>
                        )
                    })}

                </div>  
            </div>
        )
}

export default Posts;