import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const { REACT_APP_BACKEND_URL } = process.env;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      Axios.post(`${REACT_APP_BACKEND_URL}/auth/forgot-password`, {
        email,
      })
        .then((response) => {
          if (response.data.status) {
            toast.success("Check your email for reset password link");
            navigate("/login");
          } else {
            // Show error message received from backend
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          // console.error("Forgot password error:", error);
          // Show error toast message for other errors
          toast.error("An error occurred. Please try again later.");
        });
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md bg-white px-6 mt-24 pt-12 pb-4  sm:px-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl  xl:text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h1>
          <p className="mt-2 text-gray-500">Enter your email to reset</p>
        </div>
        <div className="mt-5">
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative mt-6">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
                autoComplete="off"
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
              >
                Email Address
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            {/* Send Button */}
            <div className="my-6">
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
                <span class="ml-3">Send</span>
              </button>
              <Toaster />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
