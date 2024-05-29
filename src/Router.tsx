import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostFactory from "./PostFactory";
import Post from "./Post";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/post/:id" element={<Post />} />
        <Route path="/post-fac" element={<PostFactory />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
