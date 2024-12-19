import React, { useState, useEffect } from "react";
import {FaGoogle} from 'react-icons/fa'
import { Image } from "react-bootstrap";
import logo from "../Style/images/logo.png";
import bg from "../Style/images/bg.png";
import {  useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Hero } from "../Component/HomeComponents/HeroSection";
import { Features } from "../Component/HomeComponents/Features";
import Navbar from "../Component/NavigationComponents/Navbar";
import { Footer } from "../Component/NavigationComponents/Footer";

function Homepage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      sessionStorage.setItem("user", JSON.stringify(codeResponse));
      fetchUserProfile(codeResponse.access_token);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const fetchUserProfile = async (accessToken) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      sessionStorage.setItem("profile", JSON.stringify(res.data));
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchUserProfile(JSON.parse(storedUser).access_token);
    }
  }, []);
  return (
    <>
    <Navbar/>
      <Hero/>
      <Features/>
      <Footer/>
    </>
  );
}

export default Homepage;
