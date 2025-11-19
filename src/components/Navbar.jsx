import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          💪 GymHub
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home Feed
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/create" className="nav-link">
              Create Post
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
