import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";

const { REACT_APP_BACKEND_URL } = process.env;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const { email, password, showPassword } = formData;
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !showPassword });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${REACT_APP_BACKEND_URL}/auth/login`, {
        email,
        password,
      });
      login(res.data.token, res.data.user);
      toast.success(res.data.msg);
      
      // Check user role and redirect accordingly
      if (res.data.user.role === 'admin') {
        navigate("/dashboard");
      } else {
        navigate("/allfiles");
      }
    } catch (err) {
      console.error(err.response.data);
      toast.error(err.response.data.msg || "Login failed 🚫🚫");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black transition duration-300"
            />
          </div>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={password}
              minLength="8"
              onChange={onChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black transition duration-300"
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="text-gray-600" />
              ) : (
                <AiOutlineEye className="text-gray-600" />
              )}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-900 transition duration-300"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <p>
              Don't have an account?{" "}
              <Link
                to="#"
                className="text-black font-bold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;