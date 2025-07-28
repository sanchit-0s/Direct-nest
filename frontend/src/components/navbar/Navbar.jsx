

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../lib/api";
import "./navbar.scss";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      logout(); // Still logout locally even if server call fails
      navigate("/");
    }
  };

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>DIRECT NEST</span>
        </Link>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/agent">Agents</Link>
      </div>

      <div className="right">
        {user ? (
          <div className="user">
            <img
              src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt=""
            />
            <span>{user.username}</span>
            <Link to="/profile" className="profile">
              <div className="notification">3</div>
              <span>Profile</span>
            </Link>
            <button className="logoutButton" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">Sign up</Link>
          </>
        )}

        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>

        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Home</Link>
          <Link to="/">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/">Agents</Link>
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
               <button className="logoutButton" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
