import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../src/components/pages/Home";
import About from "../src/components/pages/About";
import Blogs from "../src/components/pages/Blogs";
import SingleBlog from "../src/components/pages/SingleBlog";
import Navbar from "../src/components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/pages/Dashboard";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import AllAuthors from "./components/pages/AllAuthors";
import { Context } from "./main";
import axios from "axios";
import UpdateBlog from "./components/pages/UpdateBlog";



const App = () => {
  
  const {user,setUser,isAuthenticated,setIsAuthenticated,blogs,setBlogs} = useContext(Context)
    
    const fetchUser = async () => {
      try {
        const {data} = await axios.get("http://localhost:4000/api/v1/user/myProfile",{withCredentials:true})
        setUser(data.user)
        setIsAuthenticated(true)
      } catch (error) {
        setUser({})
        setIsAuthenticated (false)
        console.log(error.response.data.message)
      }
    }
  
    const fetchBlog = async() => {
      try {
        const {data} = await axios.get("http://localhost:4000/api/v1/blog/getAllBlog",{withCredentials:true})
        setBlogs(data.blogs)
      } catch (error) {
        setBlogs([])
        console.log(error)
      }
    }
    
  

  useEffect(()=>{
    fetchUser()
      fetchBlog()
  },[])


  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<SingleBlog />} />
          <Route path="/about" element={<About />} />
          <Route path="/authors" element={<AllAuthors />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog/update/:id" element={<UpdateBlog />} />
        </Routes>
      <Footer/>
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
