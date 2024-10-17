import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import Axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const { REACT_APP_BACKEND_URL } = process.env;

const SignUp = () => {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "firstname":
        setFirstname(value);
        break;
      case "lastname":
        setLastname(value);
        break;
      case "email":
        setEmail(value);
        // Validate email format
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email address is invalid";
        }
        break;
      case "password":
        setPassword(value);
        // Validate password format
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/.test(value)) {
          error =
            " Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "acceptTerms":
        setAcceptTerms(!acceptTerms);
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: error }); // Update errors state with the new error
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    let newErrors = {};
    if (!firstname) {
      newErrors.firstname = "First Name is required";
    }
    if (!lastname) {
      newErrors.lastname = "Last Name is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    }
    if (!acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Form is valid, proceed with submission
      Axios.post(`${REACT_APP_BACKEND_URL}/auth/signup`, {
        firstname,
        lastname,
        email,
        password,
      })
        .then((response) => {
          if (response.data.status) {
            // Redirect to login page or handle success as needed
            navigate("/login");
            // Show success toast message
            toast.success("User Registered successfully!");
          } else {
            // Show error message returned from backend
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Sign up error:", error);
          // Check if the error response contains a message
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            // Show error message returned from backend
            toast.error(error.response.data.message);
          } else {
            // Show error toast message for other errors
            toast.error("Sign up failed. Please try again later.");
          }
        });
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative mx-auto w-full max-w-md bg-white px-6 mt-16 pt-6 pb-4  sm:px-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl  xl:text-3xl font-extrabold text-gray-900">
            Sign Up
          </h1>
          <p className="mt-2 text-gray-500">Create your account</p>
        </div>
        <div className="mt-5">
          <form onSubmit={handleSubmit}>
            {/* First Name and Last Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name Field */}
              <div className="relative mt-6">
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={firstname}
                  onChange={handleChange}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
                  autoComplete="off"
                />
                <label
                  htmlFor="firstname"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  First Name
                </label>
                {errors.firstname && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
                )}
              </div>

              {/* Last Name Field */}
              <div className="relative mt-6">
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={handleChange}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
                  autoComplete="off"
                />
                <label
                  htmlFor="lastname"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Last Name
                </label>
                {errors.lastname && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="relative mt-6">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={handleChange}
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
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative mt-6">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
              />
              <label
                htmlFor="password"
                className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
              >
                Password
              </label>
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute top-1 right-0 h-full px-2"
                style={{ color: showPassword ? "black" : "gray", zIndex: 1 }} // Ensure the button stays on top
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}

            {/* Confirm Password Field */}
            <div className="relative mt-6">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
              />
              <label
                htmlFor="confirmPassword"
                className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={handleToggleConfirmPassword}
                className="absolute top-1 right-0 h-full px-2"
                style={{ color: showPassword ? "black" : "gray" }}
              >
                {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Accept Terms Field */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={acceptTerms}
                  onChange={handleChange}
                  className="peer h-4 w-4 border-gray-300 rounded-sm text-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I accept the terms and conditions
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <div className="my-6">
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
                <span className="ml-3">Sign Up</span>
              </button>
              <Toaster />
            </div>

            {/* Navigation to Login */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?
              <button
                type="button"
                onClick={navigateToLogin}
                className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"
              >
                <span className="ml-2 text-blue-800 underline font-semibold">
                  Sign in
                </span>
              </button>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
