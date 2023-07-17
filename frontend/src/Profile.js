import React, { useEffect, useState } from "react";
import DenseAppBar from "./DenseAppBar";
import "./Profile.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile(props) {
  const navigate = useNavigate();

  const [UserText, setUserText] = useState("write about you in here");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [user, setUser] = useState("");
  const [Age, setAge] = useState(0);
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState(0);
  const [edit, setEdit] = useState(0) // 1 means we can edit , 0 means we can not
  const [Followers, setFollowers] = useState([]);
  const [Following, setFollowing] = useState([]);
  const [popUp, setPopup] = useState(0);
  const [pop, setPop] = useState(0);
  const [e,setE] = useState(1);
  const [a,setA] = useState(1);
  const [p,setP] = useState(1);
  const [f,setF] = useState(1);
  const [l,setL] = useState(1);

  const tok = localStorage.getItem('token');
  useEffect(() => {
    axios.post("/api/profile", { accessToken: tok })
      .then(response => {
        console.log(response.data)
        if(response.data==="ChangeInToken") {
          alert("There is some change in token!!!");
          localStorage.removeItem('token');
          navigate("/login");
        }
        else if(response.data==="NoToken"){
          alert("Provide some token!!!");
          navigate("/login");
        }
        else{
          setFirstName(response.data.Firstname);
          setLastName(response.data.LastName);
          setUser(response.data.UserName);
          setAge(response.data.Age);
          setPhone(response.data.Contact);
          setEmail(response.data.EmailId);
          setUserText(response.data.About);
          setFollowers(response.data.Followers);
          setFollowing(response.data.Following);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function handleEdit() {
    // here i have to post request to the backend to change the data of a user
    axios.post("/api/profile/change", { accessToken: tok,FirstName: FirstName, LastName: LastName, UserName: user, Age: Age, EmailId: Email, Contact: Phone, About: UserText })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }


  document.body.style.background = "white";
  if (user.length === 0) {
    return (
        <div>
            <h1 style={{marginTop: '100px', textAlign: 'center'}}>Loading</h1>
        </div>
    )
  }
  else{
    return (
      <div style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
        <DenseAppBar />
        <section class="section about-section gray-bg" id="about" style={{ padding: "50px" }}>
          <div class="container" style={{ marginLeft: "200px", marginTop: "0px" }}>
            <div class="row align-items-center flex-row-reverse otherarea" style={{ height: "600px", padding: "0px", opacity: pop || popUp ? "0.1" : "1" }}>
              <div class="col-lg-6">
                <div class="about-text go-to" style={{ padding: "1px" }}>
                  <h3 class="dark-color" style={{ fontSize: "40px" }}>About Me</h3>
                  <textarea style={{ width: "500px", color: "black" }} type="text" rows="3" value={UserText} disabled={!edit} onChange={(e) => { setUserText(e.target.value) }}></textarea>
                  <div class="row about-list">
                    <div class="col-md-6">
                      <div class="media">
                        <label style={{ fontSize: "20px" }}>FirstName</label><br></br>
                        <input type="text" name="FirstName" value={FirstName} style={{ color: "black", width: "300px " }} onChange={(e) => { 
                          setFirstName(e.target.value) 
                          if(e.target.value.length>0) setF(1);
                          else if(e.target.value.length===0) setF(0);
                          }} disabled={!edit}></input>
                      </div>
                      <div class="media">
                        <label style={{ fontSize: "20px" }}>UserName</label><br></br>
                        <input type="text" name="user" value={user} style={{ color: "black", width: "300px " }} disabled></input>
                      </div>
                      <div class="media">
                        <label style={{ fontSize: "20px" }}>Age</label><br></br>
                        <input type="number" name="Age" value={Age} style={{ color: "black", width: "300px " }} onChange={(e) => {
                          setAge(e.target.value);
                          const newValue = e.target.value;
                          if(newValue.length===0) setA(0);
                          else{
                            const temp = isNaN(newValue);
                            console.log(temp);
                            if(temp===false){
                              if(newValue>=8 && newValue<=100) setA(1);
                              else {
                                setA(0);
                              }
                            }
                            else setA(0);
                          }
                        }} disabled={!edit}></input>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="media">
                        <label style={{ fontSize: "20px" }}>LastName</label><br></br>
                        <input type="text" name="LastName" value={LastName} style={{ color: "black", width: "300px " }} onChange={(e) => { 
                          setLastName(e.target.value) 
                          if(e.target.value.length>0) setL(1);
                          else if(e.target.value.length===0) setL(0);
                          }} disabled={!edit}></input>
                      </div>
                      <div class="media">
                        <label style={{ fontSize: "20px" }}>Phone</label><br></br>
                        <input type="number" name="Phone" value={Phone} style={{ color: "black", width: "300px " }} onChange={(e) => { 
                          const newValue = e.target.value;
                          if(newValue.length===0) setP(0);
                          else{
                            const temp = isNaN(newValue);
                            console.log(temp);
                            if(temp===false){
                              if(newValue.length===10) setP(1);
                              else {
                                setP(0);
                              }
                            }
                            else setP(0);
                          }
                          setPhone(e.target.value) 
                          }} disabled={!edit}></input>
                      </div>
                      <div class="media">
                        <label style={{ fontSize: "20px" }}>Email</label><br></br>
                        <input type="email" name="Email" value={Email} style={{ color: "black", width: "300px " }} onChange={(e) => { 
                          setEmail(e.target.value);
                          const newValue = e.target.value;
                          if(newValue.length===0) setE(0);
                          else{
                            let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                            if(res.test(newValue)===true) setE(1);
                            else {
                              setE(0);
                            }
                          }
                          }} disabled={!edit}></input>
                      </div>
                      <div class="media">
                        {/* <label style={{ fontSize: "20px" }}>Password</label><br></br>
                        <input type={togPas?"text":"password"} name="Password" value={Password} style={{ color: "black", width: "250px " }} onChange={(e) => { setPassword(e.target.value) }} disabled={!edit}></input> */}
                        {/* <button onClick={()=>{
                          if(edit===1 && togPas===0) settogPas(1);
                          else if(edit===1 && togPas===1) settogPas(0);
                        }}><RemoveRedEyeIcon style={{backgroundColor:togPas?"green":"red"}}/></button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="about-avatar">
                  <img src="https://bootdey.com/img/Content/avatar/avatar7.png" title="" alt="" style={{ marginLeft: "150px", padding: "10px", borderRadius: "50%" }} /><br></br>
                  <br></br>
                  <button disabled={popUp || pop} style={{ height: "60px", marginLeft: "140px", border: "4px solid blue", borderRadius: "10px", backgroundColor: (!edit) ? "yellow" : "white" }} onClick={() => { setEdit(1) }}>Edit Profile</button>
                  <button disabled={popUp || pop || (!f) || (!l) || (!e) || (!a) || (!p)} style={{ height: "60px", marginLeft: "100px", border: "4px solid blue", borderRadius: "10px", backgroundColor: (edit) ? "yellow" : "white" }} onClick={() => {
                    setEdit(0);
                    if (edit) handleEdit();
                  }}>Save Changes</button>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div class="counter" style={{ border: "6px solid blue", width: "500px", marginLeft: "380px", display: "inline" }}>
              <div class="row" style={{ width: "100px", display: "inline" }}>
                <p style={{ fontSize: "40px", marginLeft: "20px", display: "inline", width: "10px", padding: "10px", marginTop: "10px" }}>{Followers.length}</p>
                <div class={popUp ? "btn-group dropup show" : "btn-group dropup"} style={{ display: "inline" }}>
                  <button type="button" class="btn btn-secondary dropdown-toggle" style={{ backgroundColor: popUp ? "yellow" : "white", height: "40px", display: "inline", color: "black" }} data-toggle="dropdown" aria-haspopup="true" aria-expanded={popUp ? "true" : "false"} onClick={() => {
                    if (popUp === 1) {
                      setPopup(0);
                    }
                    else {
                      setPopup(1);
                    }
                  }} disabled={pop}>
                    Followers
                  </button>
                  <div class={popUp ? "dropdown-menu show" : "dropdown-menu"} x-placement="top-start" style={{ position: "absolute", marginBottom: "1000px", marginLeft: "490px", marginRight: "100px", transform: "translate3d(0px, -500px, 0px)", maxHeight: "400px", overflow: "auto", width: "300px" }}>
                    {Followers.map((item) => {
                      return (
                        <div>
                          <a class="dropdown-item" style={{ textAlign: "center" }}>{item}</a>
                          <button class="dropdown-item" style={{ display: "inline", backgroundColor: "red", color: "white", borderRadius: "10px", width: "150px", marginLeft: "70px", textAlign: "center", alignContent: "center" }} onClick={() => {
                            axios.post("/api/profile/RemFollower", { UserName: user, ToRemove: item ,accessToken: tok})
                              .then(response => {
                                console.log(response.data);
                                const arr = Followers.filter((value) => { return value != item });
                                setFollowers(arr);
                                setPopup(0);
                              })
                              .catch(error => {
                                console.log(error);
                              })
                          }}>REMOVE</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div class="row" style={{ width: "100px", display: "inline" }}>
                <p style={{ fontSize: "40px", marginLeft: "70px", display: "inline", width: "50px", padding: "10px", marginTop: "10px" }}>{Following.length}</p>
                <div class={pop ? "btn-group dropup show" : "btn-group dropup"} style={{ display: "inline" }}>
                  <button type="button" class="btn btn-secondary dropdown-toggle" style={{ backgroundColor: pop ? "yellow" : "white", height: "40px", display: "inline", color: "black", marginLeft: "0px" }} data-toggle="dropdown" aria-haspopup="true" aria-expanded={pop ? "true" : "false"} onClick={() => {
                    if (pop === 1) setPop(0);
                    else setPop(1);
                  }} disabled={popUp}>
                    Following
                  </button>
                  <div class={pop ? "dropdown-menu show" : "dropdown-menu"} x-placement="top-start" style={{ position: "absolute", marginBottom: "1000px", marginLeft: "490px", marginRight: "100px", transform: "translate3d(0px, -500px, 0px)", maxHeight: "400px", overflow: "auto", width: "300px" }}>
                    {Following.map((item) => {
                      return (
                        <div>
                          <div>
                            <a class="dropdown-item" style={{ textAlign: "center" }}>{item}</a>
                            <button class="dropdown-item" style={{ display: "inline", backgroundColor: "red", color: "white", borderRadius: "10px", width: "150px", marginLeft: "70px", textAlign: "center", alignContent: "center" }} onClick={() => {
                              axios.post("/api/profile/RemFollowing", { UserName: user, ToRemove: item ,accessToken: tok})
                                .then(response => {
                                  console.log(response.data);
                                  const arr = Following.filter((value) => { return value != item });
                                  setFollowing(arr);
                                  setPop(0);
                                })
                                .catch(error => {
                                  console.log(error);
                                })
                            }}>UNFOLLOW</button>
                          </div>
                        </div>);
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
} 

export default Profile;
