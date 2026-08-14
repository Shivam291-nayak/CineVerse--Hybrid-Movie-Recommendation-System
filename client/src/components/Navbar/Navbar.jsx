import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/movies?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="cg-navbar">
      <div className="cg-navbar-inner">

        {/* Logo */}
        <Link to="/" className="cg-logo">
          <span>Cine</span>Verse
        </Link>

        {/* Navigation */}
        <div className="cg-nav-links">
          <Link to="/" className="cg-nav-link active">
            Home
          </Link>

          <Link to="/movies" className="cg-nav-link">
            Movies
          </Link>

          <Link to="/movies" className="cg-nav-link">
            TV Shows
          </Link>

          <Link to="/watchlist" className="cg-nav-link">
            Watchlist
          </Link>

          <div className="cg-genres">
            <button className="cg-nav-link cg-genre-button">
              Genres
              <i className="bi bi-chevron-down"></i>
            </button>

            <div className="cg-genre-menu">
              <Link to="/movies?genre=Action">Action</Link>
              <Link to="/movies?genre=Comedy">Comedy</Link>
              <Link to="/movies?genre=Drama">Drama</Link>
              <Link to="/movies?genre=Horror">Horror</Link>
              <Link to="/movies?genre=Romance">Romance</Link>
              <Link to="/movies?genre=Sci-Fi">Sci-Fi</Link>
              <Link to="/movies?genre=Thriller">Thriller</Link>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="cg-navbar-right">

          {/* Search */}
          {searchOpen && (
            <form
              className="cg-search-box"
              onSubmit={handleSearch}
            >
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </form>
          )}

          <button
            className="cg-icon-button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <i className="bi bi-search"></i>
          </button>

          {/* Notification */}
          <button className="cg-icon-button">
            <i className="bi bi-bell"></i>
            <span className="notification-dot"></span>
          </button>

          {/* Profile */}
          {isAuthenticated ? (
            <div className="cg-profile">
              <button className="cg-profile-button">
                <div className="cg-avatar">
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              </button>

              <div className="cg-profile-menu">
                <div className="profile-menu-user">
                  <div className="cg-avatar large">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <div>
                    <strong>{user?.name || "User"}</strong>
                    <small>{user?.email || ""}</small>
                  </div>
                </div>

                <div className="profile-divider"></div>

                <Link to="/profile" className="profile-usage-tab">
                  <i className="bi bi-bar-chart-fill"></i>
                  <span>Usage</span>
                </Link>

                <button className="profile-logout-btn" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="cg-login-button">
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;