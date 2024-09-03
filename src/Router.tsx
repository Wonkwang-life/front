import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import { useRecoilValue } from "recoil";
import { userState } from "./state/userState";

const Post = lazy(() => import("./pages/Post/Post"));
const PostFactory = lazy(() => import("./pages/Post/PostFactory"));
const Login = lazy(() => import("./pages/404/Admin/Login"));
const Home = lazy(() => import("./pages/Home/Home"));
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const Products = lazy(() => import("./pages/Products/Products"));
const Location = lazy(() => import("./pages/Location/Location"));
const CompanyIntro = lazy(() => import("./pages/Intro/CompanyIntro"));
const IntroNav = lazy(() => import("./pages/Intro/IntroNav"));
const PeopleIntro = lazy(() => import("./pages/Intro/PeopleIntro"));
const AddPeople = lazy(() => import("./pages/Intro/AddPeople"));
const ScrollToTopBtn = lazy(() => import("./components/ScrollToTopBtn"));
const NotPageFound = lazy(() => import("./pages/404/NotPageFound"));

const Router = () => {
  const user = useRecoilValue(userState);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<Products />} />
          <Route path="/location" element={<Location />} />
          <Route path="/intro" element={<IntroNav />}>
            <Route path="/intro" element={<CompanyIntro />} />
            <Route path="/intro/people" element={<PeopleIntro />} />
          </Route>
          <Route path="*" element={<NotPageFound />} />
          {user && (
            <>
              <Route path="/add-people" element={<AddPeople />} />
              <Route path="/write" element={<PostFactory />} />
            </>
          )}
        </Routes>
        <ScrollToTopBtn />
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
