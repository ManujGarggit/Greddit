import React, { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import "./Requests.css"
import ReportsBody from "./ReportsBody";

function Reports(){
    const navigate = useNavigate();
    const tok = localStorage.getItem('token');
    const CurrUrl = document.URL;
    const dummy = CurrUrl.split("/");
    const Name = dummy[4];
    const [Report,setReport] = useState([]);
    const [UserName, setUserName] = useState("");
    const [Mod,setMod] = useState([]);
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
        axios.post("/api/GetUser", { accessToken: tok })
            .then(response => {
                setUserName(response.data.User);
            })
            .catch(error => {
                console.log(error);
            })
        axios.post("/api/profile/GetReports", { Name: Name,accessToken: tok  })
            .then(response => {
                setReport(response.data.FinalReports);
                setMod(response.data.Mod);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    if(Yes===-1){
        navigate("/profile");
    }
    
    const temp1 = Mod.indexOf(UserName);
    document.body.style.background = "#f5f5f5";

    function handleDelete(ID){
        const ReportN = Report.filter((item)=>{
            return (item._id!==ID);
        })
        setReport(ReportN);
        axios.post("/api/profile/DeleteReport",{NameG:Name,id:ID,accessToken: tok })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

        return(
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
                {
                    Report.map((item)=>{
                        return(
                            <div>
                                <ReportsBody Delete={handleDelete} NameG={Name} ID={item._id} state={item.State} ReportedBy={item.ReportedBy} ReportedUser={item.ReportedUser} Concern={item.Concern} Text={item.Text} />
                            </div>
                        )
                    })
                }
            </div>
        )
}

export default Reports;