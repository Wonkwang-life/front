import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostFactory from "./pages/Post/PostFactory";
import Post from "./pages/Post/Post";
import Login from "./pages/Admin/Login";
import Home from "./pages/Home/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./pages/Home/ProductList";
import Location from "./pages/Location/Location";
import CompanyIntro from "./pages/Intro/CompanyIntro";
import IntroNav from "./pages/Intro/IntroNav";
import PeopleIntro from "./pages/Intro/PeopleIntro";
import ScrollToTopBtn from "./components/ScrollToTopBtn";
import ScrollToTop from "./components/ScrollToTop";

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Post />} />
        <Route path="/write" element={<PostFactory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/location" element={<Location />} />
        <Route path="/intro" element={<IntroNav />}>
          <Route path="/intro" element={<CompanyIntro />} />
          <Route path="/intro/people" element={<PeopleIntro />} />
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
      <ScrollToTopBtn />
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
