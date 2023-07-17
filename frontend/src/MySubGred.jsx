import React, { useEffect, useState } from "react";
import "./MySubGred.css"
import Note from "./MySubGredNote"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReactModal from "react-modal"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';

function MySubGred() {
    const navigate = useNavigate();
    const tok = localStorage.getItem('token');
    const [Name, setName] = useState("");
    const [Des, setDes] = useState("");
    const [Key, setKey] = useState("");
    const [Gred, setGred] = useState([]);
    const [Tag,setTag] = useState("");
    document.body.style.background = "#f5f5f5";
    document.body.style.overflowY = "auto";

    const [tog, setTog] = useState(0);
    const [head,setHead] = useState(1); // 1 for original , 0 for new 
    const [NameSubGred,setNameSubGred] = useState("");

    useEffect(() => {
        axios.post("/api/profile/GetMySubGred", { accessToken: tok })
            .then(response => {
                const ToMap = response.data;
                setGred(ToMap)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    function handleDelete(Name){
        const ToDelete = Name;
        axios.post("/api/profile/DelMySubGred",{Name:ToDelete,accessToken: tok})
        .then(response=>{
            console.log(response.data);
            const Arr = Gred.filter((value)=>{return value.Name!=ToDelete});
            setGred(Arr);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    function handleOpen(Name){
        setNameSubGred(Name);
        setHead(0);
    }

    const year = new Date().getFullYear();
        return (
            <div>
                <header style={{backgroundColor:"royalblue", height: "70px"}}>
                    {head ? (
                        <div>
                            <h1 style={{color: "white",display:"inline",marginLeft:"10px"}}>
                                MY SUB GREDDIT
                            </h1>
                            <button  style={{marginLeft:"1200px",backgroundColor:"royalblue",border:"none",color:"white",fontSize:"20px"}} onClick={()=>{
                                navigate("/profile");
                            }}>PROFILE</button>
                            <button style={{marginLeft:"20px",backgroundColor:"royalblue",border:"none",color:"white",fontSize:"20px"}} onClick={()=>{
                                localStorage.removeItem('token');
                                navigate("/login");
                            }}>LOGOUT</button>
                        </div>
                    ):(
                        <div>
                            <h1 style={{color: "white",display:"inline",marginLeft:"10px"}}>
                                MY SUB GREDDIT
                            </h1>
                            <button  style={{marginLeft:"970px",backgroundColor:"royalblue",border:"none",color:"white",fontSize:"20px"}} onClick={()=>{
                                navigate("/profile/"+ NameSubGred + "/Users");
                            }}>USERS</button>
                            <button style={{marginLeft:"20px",backgroundColor:"royalblue",border:"none",color:"white",fontSize:"20px"}} onClick={()=>{
                                navigate("/profile/" + NameSubGred + "/Requests");
                            }}>REQUESTS</button>
                            <button style={{marginLeft:"20px",backgroundColor:"royalblue",border:"none",color:"white",fontSize:"20px"}} onClick={()=>{
                                navigate("/profile/" + NameSubGred + "/Reports");
                            }}>REPORTS</button>
                            <button style={{marginLeft:"20px",backgroundColor:"royalblue",border:"none",color:"white",fontSize:"20px"}} onClick={()=>{setHead(1)}}>BACK</button>
                        </div>
                    )}
                </header>
                {head ? (
                    <div>
                        <AddCircleIcon style={{ display: "block", width: "3570px", height: "40px",marginTop:"10px" }} onClick={() => {
                            if (tog === 0) setTog(1);
                            else setTog(0);
                        }} />
                        <ReactModal isOpen={tog} style={{ overlay: { width: "1000px", marginLeft: "420px", marginTop: "40px", height: "650px", border: "10px solid royalblue" } }}>
                            <form>
                                <input type="text" value={Name} name="Name" placeholder="Name" style={{ display: "block", padding: "20px", margin: "10px", width: "250px", height: "80px", marginLeft: "290px", color: "blue" }} onChange={(e) => setName(e.target.value)}></input>
                                <textarea rows={3} value={Des} placeholder="Description" name="Description" type="text" style={{ display: "block", padding: "20px", margin: "10px", width: "500px", height: "150px", marginLeft: "160px", color: "blue" }} onChange={(e) => setDes(e.target.value)}></textarea>
                                <input type="text" name="Keywords" value={Key} placeholder="write comma separated list of banned keywords" style={{ display: "inline", padding: "20px", margin: "10px", width: "600px", height: "100px", marginLeft: "100px", color: "blue" }} onChange={(e) => setKey(e.target.value)}></input>
                                <input type="text" name="Tags" value={Tag} placeholder="write comma separated list of tags" style={{ display: "inline", padding: "20px", margin: "10px", width: "600px", height: "100px", marginLeft: "100px", color: "blue" }} onChange={(e) => setTag(e.target.value)}></input>
                                <button style={{ backgroundColor: "red", color: "white", borderRadius: "10px", marginLeft: "20px" }} onClick={(e) => {
                                    e.preventDefault();
                                    const Tags = Tag.toLowerCase().split(",");
                                    const TagsArr = Tags.filter((value)=>{return value!=""});
                                    const Keys = Key.split(",");
                                    const KeysArr = Keys.filter((value)=>{return value!=""});
                                    axios.post("/api/profile/AddMySubGred", { Name: Name, Des: Des, Key: KeysArr, Tag:TagsArr,accessToken: tok })
                                        .then(response => {
                                            console.log(response.data);
                                            if (response.data === 0) {
                                                alert("A SubGreddit exists with same Name");
                                            }
                                            else{
                                                setGred(prevValue=>{
                                                    return [
                                                        ...prevValue,
                                                        {
                                                            Name:Name,
                                                            Description:Des,
                                                            Key:KeysArr,
                                                            Tag:TagsArr,
                                                            Follower:["me"],
                                                            Post:[]
                                                        }
                                                    ]
                                                })
                                                setTog(0);
                                            }
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        })
                                }}>Submit</button>
                            </form>
                        </ReactModal>
                        {Gred.map(item=>{
                            return (
                                <Note onOpen={handleOpen} onDelete={handleDelete} Description={item.Description} Name={item.Name} Key={item.Key} Number={item.Follower.length} Tag={item.Tag} NumberP={item.Post.length}/>
                            )
                        })}
                    </div>
                ):(
                    <div>
                       <TableViewOutlinedIcon style={{color:"red",fontSize:"500px",marginLeft:"630px",marginTop:"140px"}}/>
                    </div>
                )}
            </div>
        )
}   

export default MySubGred;