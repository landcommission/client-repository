import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccessDenied from "../login/AccessDenied";

const GameHome = (currentUser) => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/auth/verify")
  //     .then((res) => {
  //       if (!res.data.status) {
  //         navigate("/login");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error verifying authentication:", error);
  //       navigate("/login"); // Redirect to login page on error
  //     });
  // }, [navigate]);
  return (
    currentUser && currentUser.role === 'admin' ?
    <div className="relative flex items-center overflow-hidden bg-white dark:bg-gray-800">
      <div className="container relative flex px-6 py-16 mx-auto">
        <div className="relative flex flex-col sm:w-2/3 lg:w-2/5">
          <span className="w-20 h-2 mb-12 bg-gray-800 dark:bg-white"></span>
          <h1 className="flex flex-col text-6xl font-black leading-none text-gray-800 uppercase font-bebas-neue sm:text-8xl dark:text-white">
            Managing Land
            <span className="text-5xl text-orange-800 capitalize sm:text-7xl">
              Resources
            </span>
          </h1>

          <p className="text-sm text-gray-700 sm:text-base dark:text-white">
            The National Land Commission (NLC) is a governmental body
            established under the Constitution of Kenya, mandated to manage
            public land on behalf of national and county governments. Our
            responsibilities include initiating investigations into land
            injustices, recommending redress, and overseeing land use planning
            nationwide. Committed to upholding transparency and fairness in land
            administration, NLC plays a pivotal role in promoting sustainable
            land management practices for the benefit of present and future
            generations.
          </p>

          <div className="flex mt-8">
            <Link
              to="/dashboard"
              className="px-4 py-2 mr-4 text-white  bg-pink-500 border-2 border-transparent rounded-full text-md hover:bg-pink-400"
            >
              Go To Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-pink-500 bg-transparent border-2 border-pink-500 rounded-full dark:text-white hover:bg-pink-500 hover:text-white text-md"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="relative hidden sm:block sm:w-1/3 lg:w-3/5">
          <img
            src="/images/grass.png"
            className="max-w-xs m-auto md:max-w-xl "
            alt="Boss"
          />
        </div>
      </div>
    </div>
    : <AccessDenied />
  );
};

export default GameHome;
