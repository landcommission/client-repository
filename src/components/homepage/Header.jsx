import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BiLogOut, BiChevronDown } from "react-icons/bi";
import { IoMenu, IoClose } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { authState, logout } = useContext(AuthContext);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleNav = () => setIsNavVisible(!isNavVisible);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeDropdowns = () => {
    setIsNavVisible(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home", roles: ["all"] },
    { path: "/open", label: "Public Resources", roles: ["all"] },
    { path: "/allfiles", label: "Internal Files", roles: ["admin", "staff"] },
    { path: "/dashboard", label: "Dashboard", roles: ["admin"] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes("all") || 
    (authState.isAuthenticated && item.roles.includes(authState.user.role))
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-amber-50"}`}>
      <nav className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={closeDropdowns}>
            <img className="h-12 w-12 mr-3" src="/images/nlc.png" alt="Logo" />
            <div className="flex flex-col">
              <span className="text-green-800 text-lg font-extrabold tracking-tight">
                National Land Commission
              </span>
              <span className="text-amber-600 text-xs font-semibold hidden sm:inline">
                Republic of Kenya
              </span>
            </div>
          </Link>
          <div className="flex items-center">
            <button
              className="text-green-800 focus:outline-none lg:hidden"
              onClick={toggleNav}
            >
              {isNavVisible ? <IoClose size={28} /> : <IoMenu size={28} />}
            </button>
            <div className="hidden lg:flex items-center space-x-8">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-bold text-sm hover:text-amber-600 transition-colors ${
                    location.pathname === item.path 
                      ? "text-amber-600 border-b-2 border-amber-600 pb-1" 
                      : "text-green-800"
                  }`}
                  onClick={closeDropdowns}
                >
                  {item.label}
                </Link>
              ))}
              {authState.isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center text-green-800 hover:text-amber-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mr-2">
                      {getInitials(`${authState.user.firstname} ${authState.user.lastname}`)}
                    </div>
                    <span className="mr-1 font-bold">{authState.user.firstname}</span>
                    <BiChevronDown size={24} />
                  </button>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="font-bold text-green-800 truncate">
                            {authState.user.firstname} {authState.user.lastname}
                          </div>
                          <div className="text-xs text-green-600 mt-1 truncate" title={authState.user.email}>
                            {authState.user.email}
                          </div>
                          <div className="text-xs font-semibold text-amber-600 mt-1 uppercase">
                            {authState.user.role}
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-amber-50 transition-colors"
                        >
                          <BiLogOut size={20} className="mr-2 flex-shrink-0" />
                          <span className="font-semibold">Sign out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-green-700 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                  onClick={closeDropdowns}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isNavVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 space-y-3 pb-4"
            >
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block font-bold text-sm hover:text-amber-600 transition-colors ${
                    location.pathname === item.path ? "text-amber-600" : "text-green-800"
                  }`}
                  onClick={closeDropdowns}
                >
                  {item.label}
                </Link>
              ))}
              {authState.isAuthenticated ? (
                <div className="pt-4 border-t border-green-100">
                  <div className="text-sm mb-3 text-green-800 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mr-2">
                      {getInitials(`${authState.user.firstname} ${authState.user.lastname}`)}
                    </div>
                    <div>
                      <span className="font-bold truncate block">{authState.user.firstname} {authState.user.lastname}</span>
                      <span className="block text-xs mt-1 truncate" title={authState.user.email}>{authState.user.email}</span>
                      <span className="block text-xs font-semibold text-amber-600 mt-1 uppercase">{authState.user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-green-800 hover:text-amber-600 transition-colors"
                  >
                    <BiLogOut size={20} className="mr-2 flex-shrink-0" />
                    <span className="font-bold">Sign out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block bg-green-700 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-colors text-center shadow-md hover:shadow-lg"
                  onClick={closeDropdowns}
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;