import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import First from "./First";
import Profile from "./Profile";
import Protected from "./Protected";
import { Navigate } from "react-router-dom";
import ProtectedLogin from "./ProtectedLogin";
import MySubGred from "./MySubGred"
import Requests from "./Requests";
import Users from "./Users";
import SubGred from "./SubGred";
import Posts from "./Posts";
import Saved from "./Saved";
import Reports from "./Reports";
import ProtectedMod from "./ProtectedMod";
import NotFound from "./NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={localStorage.getItem("Token") ? <Navigate replace to="/profile" /> :  <Navigate replace to="/login" /> } />
        <Route path="/login" element={<ProtectedLogin  children={<First />} />} />
        <Route path="/profile" element={<Protected children={ <Profile />}></Protected>} />
        <Route path="/profile/MySubGred" element={<Protected children={ <MySubGred />}></Protected>} />
        <Route path="/profile/:Name/Users" element={<ProtectedMod children={ <Users />}></ProtectedMod>} />
        <Route path="/profile/:Name/Requests" element={<ProtectedMod children={ <Requests />}></ProtectedMod>} />
        <Route path="/profile/:Name/Reports" element={<ProtectedMod children={ <Reports />}></ProtectedMod>} />
        <Route path="/profile/SubGred" element={<Protected children={ <SubGred />}></Protected>} />
        <Route path="/profile/SubGred/:Name" element={<Protected children={<Posts />}></Protected>} />
        <Route path="/profile/Saved" element={<Protected children={<Saved />}></Protected>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
