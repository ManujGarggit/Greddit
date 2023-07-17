import { Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Protected = ({ isLogged, children }) => {
    const islogged = localStorage.getItem("token");
    if (!islogged) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default Protected;