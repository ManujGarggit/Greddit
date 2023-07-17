import { Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";


const ProtectedLogin = ({ isLogged, children }) => {
    const islogged = localStorage.getItem('token');
    if (islogged) {
        return <Navigate to="/profile" replace />;
    }
    return children;
};

export default ProtectedLogin;
