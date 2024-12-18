import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get current user data from AuthContext

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search/${searchQuery.trim()}`); // Use dynamic route
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear credentials from localStorage
    localStorage.removeItem("userInfo"); // Remove stored user info
    navigate("/"); // Redirect to the homepage (or login page)
  };

  const handleLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <h1>SHELF</h1>
          </Link>

          <div className="relative sm:w-72 w-40 space-x-2">
            <IoSearchOutline className="absolute inline-block left-3 inset-y-2" />
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
            />
          </div>
        </div>

        <div className="relative flex items-center md:space-x-3 space-x-2">
          <Link to="/dashboard" className="border-b-2 border-primary">
            Dashboard
          </Link>

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
