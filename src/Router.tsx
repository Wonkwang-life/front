import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostFactory from "./pages/Post/PostFactory";
import Post from "./pages/Post/Post";
import Login from "./pages/Admin/Login";
import Home from "./pages/Home/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./pages/Home/ProductList";
import Location from "./pages/Intro/Location";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Post />} />
        <Route path="/write" element={<PostFactory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/location" element={<Location />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
