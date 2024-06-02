import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostFactory from "./pages/Post/PostFactory";
import Post from "./pages/Post/Post";
import Login from "./pages/Admin/Login";
import Home from "./pages/Home/Home";
import Header from "./components/Header";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/post-fac" element={<PostFactory />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
