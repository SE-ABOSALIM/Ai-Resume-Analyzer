import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="flex">
      <nav className="navbar">
        <Link to="/">
          <p className="text-xl font-bold text-gradient">RESUMIND</p>
        </Link>
        <Link to="/upload">
          <button className="primary-button primary-button-hover">
            Upload Resume
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
