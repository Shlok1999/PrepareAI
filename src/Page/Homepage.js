import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import logo from "../Style/images/logo.png";
import bg from "../Style/images/bg.png";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="main">
      <div className="content">
        <div className="left">
          <div className="logo">
            <Image src={logo} alt="Prepare.Ai"></Image>
          </div>
          <div className="description" alt="Prepare.Ai - background">
            Revolutionize Your Study Experience: AI-Powered Tools for Effective
            Exam Preparation!
          </div>
          <div className="button-container">
            <button onClick={login} className="login-with-google-btn">
              Sign in with Google
            </button>
          </div>
        </div>
        <div className="right">
          <Image src={bg}></Image>
        </div>
      </div>
      <div className="card-container">
        <h1>What you get with Prepare.Ai?</h1>
        <div className="card">
          <div className="left">
            <p className="title">Unlock Your Potential</p>
            <span>
              and discover personalized strategies tailored to your unique
              learning style.
            </span>
          </div>
          <div className="right">
            <Image src={bg}></Image>
          </div>
        </div>

        <div className="card">
          <div className="left">
            <p className="title">Transform Your Study Habits</p>
            <span>
              into effective routines that maximize retention and understanding.
            </span>
          </div>
          <div className="right">
            <Image src={bg}></Image>
          </div>
        </div>

        <div className="card">
          <div className="left">
            <p className="title">AI-Powered Learning Paths</p>
            <span>to improve your shortcomings</span>
          </div>
          <div className="right">
            <Image src={bg}></Image>
          </div>
        </div>
      </div>
      <div className="footer-container">
        <p>
          Copyright ©{new Date().getFullYear()} Power.Ai | All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Homepage;
