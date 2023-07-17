import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const ProtectedMod = ({ isLogged, children }) => {
    console.log("here in amod")
    const URL = document.URL
    const NameD = useParams()
    const NameG = NameD.Name
    
    const islogged = localStorage.getItem("token");
    if (!islogged) {
        return <Navigate to="/login" replace />;
    }
    return children
};

export default ProtectedMod;