import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./MySubGred.css"
import NoteSub from "./SubGredNote";
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import FuzzySearch from 'fuzzy-search';

function SubGred() {
    const navigate = useNavigate();
    const tok = localStorage.getItem('token');
    const [Gred, setGred] = useState([]);
    const [Tog, setTog] = useState(0);
    const [NameToSearch, setNameToSearch] = useState("");
    const [TagsToSearch, setTagsToSearch] = useState("");
    const [Tog1, setTog1] = useState(0);
    const [Tog2, setTog2] = useState(0);
    const [Joined, setJoined] = useState([]); // contains the name of the subgreddits which this user has joined 
    const [UserName, setUserName] = useState("");
    const [count, setCount] = useState(0);
    const [EmailId, setEmailId] = useState("");
    const [yes, setYes] = useState(0);
    const [Mod, setMod] = useState([]);
    const [GredTemp, setGredTemp] = useState([]);


    document.body.style.overflowY = "auto";

    useEffect(() => {
        axios.post("/api/GetJoin", { accessToken: tok })
            .then(response => {
                const ToMap = response.data;
                var NameArr = [];
                ToMap.map((value) => {
                    NameArr.push(value.Name);
                })
                setJoined(NameArr);
            })
            .catch(error => {
                console.log(error);
            })
        axios.post("/api/GetMod", { accessToken: tok })
            .then(response => {
                const ToMap = response.data;
                var NameArr = [];
                ToMap.map((value) => {
                    NameArr.push(value.Name);
                })
                setMod(NameArr);
            })
            .catch(error => {
                console.log(error);
            })

        axios.post("/api/GetUser", { accessToken: tok })
            .then(response => {
                setEmailId(response.data.Email);
                setUserName(response.data.User);
            })
            .catch(error => {
                console.log(error);
            })
        axios.post("/api/profile/GetSubGred", { accessToken: tok })
            .then(response => {
                const ToMap = response.data;
                setGred(ToMap);
                setGredTemp(ToMap);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    var items=[];
    let i=0;
    Gred.map((value)=>{
        const keyword = value.Key;
        let j=keyword.length;
        for(var k=0;k<j;k++){
            items.push({id:i,value:keyword[k]});
            i++;
        } 
    })

    function handleLeave(Name) {
        axios.post("/api/profile/Leave", { NameU: UserName, NameG: Name,accessToken: tok  })
            .then(response => {
                if (response.data === 2) {
                    const NewArr = Joined.filter((value) => { return value != Name });
                    setJoined(NewArr);
                }
                const withoutThat = Gred.filter((item)=>{return item.Name!=Name});
                console.log(withoutThat);
                let w = Gred.filter((item)=>{return item.Name===Name});
                var ThatFollower = [],
                ThatFollower = w[0].Follower;
                ThatFollower.pop();
                const newObj = {...w[0],Follower:ThatFollower};
                setGred(()=>{return [...withoutThat,newObj]});
            })
            .catch(error => {
                console.log(error);
            })
    }

    function handleJoin(Name) {
        axios.post("/api/profile/Join", { NameU: UserName, NameG: Name, EmailU: EmailId,accessToken: tok  })
            .then(response => {
                
                if (response.data === 0) {
                    alert("You have left the subgreddit once so you can't join it again");
                }
                else if (response.data === 1) {
                    alert("You have already requested to join the subgreddit");
                }
                else if(response.data===4){
                    alert("Try after some time , you can't join once rejected!!!");
                }
                else if(response.data===5){
                    alert("You have been blocked from this subgred , you can't request to join again!!!");
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    if (yes === 0) {
        const PrevArr = Gred.sort((a, b) => {
            const temp1 = Joined.indexOf(a.Name);
            const temp2 = Joined.indexOf(b.Name);
            if (temp2 > temp1) return 1;
            else if (temp1 > temp2) return -1;
            else return 0;
        })
    }


    const searcher = new FuzzySearch(Gred, ['Name'], {
        caseSensitive: false,
      });
    return (
        <div>
            <header style={{ backgroundColor: "royalblue", height: "70px" }}>
                <div>
                    <h1 style={{ color: "white", display: "inline", marginLeft: "10px" }}>
                        SUB GREDDIT
                    </h1>
                    <input value={TagsToSearch} style={{ display: "inline", marginLeft: "400px", position: "absolute", marginTop: "20px" }} type="text" placeholder="Search for Tags" onChange={(e) => { setTagsToSearch(e.target.value) }}></input>
                    <RefreshIcon style={{color:"white",backgroundColor:"blue",position: "absolute",marginLeft:"710px",marginTop: "20px",height: "35px" ,border:"2px solid black"}} onClick={()=>{setTagsToSearch("");setTog1(0);setGred(GredTemp);setYes(0);}}/>
                    <FilterAltIcon disabled={Tog1} style={{ position: "absolute", marginLeft: "740px", marginTop: "20px", backgroundColor: Tog1 ? "red" : "blue", color: "white", height: "35px" ,border:"2px solid black"}} onClick={() => {
                        const Tagsarr = TagsToSearch.toLowerCase().split(",");
                        const TagsArr = Tagsarr.filter((value) => { return value != "" });
                        if(TagsToSearch.length===0) setGred([]);
                        else{
                                if (TagsArr.length) {
                                const PrevArr = GredTemp.sort((a, b) => {
                                    const temp1 = Joined.indexOf(a.Name);
                                    const temp2 = Joined.indexOf(b.Name);
                                    if (temp2 > temp1) return 1;
                                    else if (temp1 > temp2) return -1;
                                    else return 0;
                                })
                                const NewArr = GredTemp.filter((item)=>{
                                    const toSearch = item.Tag;
                                    let flag=0;
                                    for(var i=0;i<TagsArr.length;i++){
                                        const temp1 = toSearch.indexOf(TagsArr[i]);
                                        if(temp1>=0) flag=1; 
                                    }
                                    return flag;
                                })
                                console.log(NewArr);
                                setGred(NewArr);
                            }
                        }
                    }} />
                    <input value={NameToSearch} style={{ display: "inline", marginLeft: "820px", position: "absolute", marginTop: "20px" }} type="text" placeholder="Search for a Name" onChange={(e) => { setNameToSearch(e.target.value) }}></input>
                    <RefreshIcon style={{color:"white",backgroundColor:"blue",position: "absolute",marginLeft:"1130px",marginTop: "20px",height: "35px" ,border:"2px solid black"}} onClick={()=>{setNameToSearch("");setTog2(0);setGred(GredTemp);setYes(0);}}/>
                    <SearchIcon disabled={Tog2} style={{ position: "absolute", marginLeft: "1160px", marginTop: "20px", backgroundColor: Tog2 ? "red" : "blue", color: "white", height: "35px" ,border:"2px solid black"}} onClick={() => {
                        if(NameToSearch.length===0) setGred([]);
                        else{
                            const PrevArr = GredTemp.sort((a, b) => {
                                const temp1 = Joined.indexOf(a.Name);
                                const temp2 = Joined.indexOf(b.Name);
                                if (temp2 > temp1) return 1;
                                else if (temp1 > temp2) return -1;
                                else return 0;
                            })
                            const tosearch = NameToSearch.toLowerCase();
                            const result = searcher.search(tosearch);
                            console.log(result)
                            setGred(result);
                        }
                    }} />
                    <button style={{ position: "absolute", marginLeft: "1210px", marginTop: "20px", backgroundColor: "royalblue", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                        navigate("/profile");
                    }}>PROFILE</button>
                    <button style={{ position: "absolute", marginLeft: "1310px", marginTop: "20px", backgroundColor: "royalblue", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                        localStorage.removeItem('token');
                        navigate("/login");
                    }}>LOGOUT</button>
                    <button style={{ position: "absolute", marginLeft: "1410px", marginTop: "20px", backgroundColor: "royalblue", border: "none", color: "white", fontSize: "20px" }} onClick={() => {
                        if (Tog === 0) setTog(1);
                        else setTog(0);
                    }}>SORT</button>
                    <div style={{ position: "absolute", marginLeft: "1600px", border: "none" }} class="dropdown-menu show">
                        <div class={Tog ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuLink">
                            <button style={{ border: "none", display: "block", backgroundColor: "white", marginTop: "10px", marginLeft: "60px" }} onClick={() => {
                                setYes(0);
                                setTog(0);
                            }}>NONE</button>
                            <p style={{ display: "inline" }} class="dropdown-item">NAME</p>
                            <button style={{ backgroundColor: "blue", color: "white", borderRadius: "10px", marginLeft: "20px" }} onClick={() => {
                                const SortedGred = Gred.sort((a, b) => {
                                    const temp1 = a.Name.toLowerCase();
                                    const temp2 = b.Name.toLowerCase();
                                    if (temp1 < temp2) return -1;
                                    else if (temp1 > temp2) return 1;
                                    else return 0;
                                })
                                setGred(SortedGred);
                                setYes(yes + 1);
                                setTog(0);
                            }}>ASC</button>
                            <button style={{ backgroundColor: "blue", color: "white", borderRadius: "10px", marginLeft: "110px", marginTop: "10px" }} onClick={() => {
                                const SortedGred = Gred.sort((a, b) => {
                                    const temp1 = a.Name.toLowerCase();
                                    const temp2 = b.Name.toLowerCase();
                                    if (temp1 < temp2) return 1;
                                    else if (temp1 > temp2) return -1;
                                    else return 0;
                                })
                                setGred(SortedGred);
                                setYes(yes + 1);
                                setTog(0);
                            }}>DESC</button>
                            <button style={{ border: "none", backgroundColor: "white", marginTop: "10px", marginLeft: "30px" }} onClick={() => {
                                const SortedGred = Gred.sort((a, b) => {
                                    const temp1 = Number(a.Follower.length);
                                    const temp2 = Number(b.Follower.length);
                                    if (temp1 < temp2) return 1;
                                    else if (temp1 > temp2) return -1;
                                    else return 0;
                                })
                                setGred(SortedGred);
                                setYes(yes + 1);
                                setTog(0);
                            }}>FOLLOWERS</button>
                            <button style={{ border: "none", backgroundColor: "white", marginTop: "10px", marginLeft: "20px" }} onClick={() => {
                                const SortedGred = Gred.sort((a, b) => {
                                    const temp1 = a.createdAt;
                                    const temp2 = b.createdAt;
                                    if (temp1 < temp2) return 1;
                                    else if (temp1 > temp2) return -1;
                                    else return 0;
                                })
                                setGred(SortedGred);
                                setYes(yes + 1);
                                setTog(0);
                            }} >CREATION DATE</button>
                        </div>
                    </div>
                </div>
            </header>
            {
                Gred.map(item => {
                    return (
                        <NoteSub Leave={handleLeave}  Join={handleJoin} Joined={Joined}  Blocked={item.Blocked} User={UserName} Mod={Mod} Description={item.Description} Name={item.Name} Key={item.Key} Number={item.Follower.length} Tag={item.Tag} NumberP={item.Post.length}/>
                    )
                })}
        </div>
    )
}

export default SubGred;