import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [cartCount, setCartCount] = useState(0);

  const logout = () => {
    localStorage.removeItem("user");
    // notify other components and reload to login
    window.dispatchEvent(new Event("userChanged"));
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  useEffect(() => {
    const handleUserChange = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch (e) {
        setUser(null);
      }
    };

    window.addEventListener("userChanged", handleUserChange);
    window.addEventListener("storage", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) return;

      const res = await API.get(
        `/cart/${user.user._id}`
      );

      setCartCount(res.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo">
        ShopEZ
      </Link>

      <div className="nav-links">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ marginLeft: 12 }}>Register</Link>
          </>
        ) : (
          <>
            {user?.user?.role?.toLowerCase() === "admin" ? (
              <Link to="/admin">Admin</Link>
            ) : (
              <div className="nav-actions">
                <Link to="/orders" className="nav-icon" title="My Orders">
                  <span className="icon">👤</span>
                </Link>
                <Link to="/cart" className="nav-icon" title="My Cart">
                  <span className="icon">🛒</span>
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
              </div>
            )}
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;