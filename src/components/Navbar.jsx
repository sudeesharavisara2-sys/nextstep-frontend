import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/lostfound">
          <i className="bi bi-search me-2"></i>
          Campus Lost & Found
        </Link>

        <div className="ms-auto">
          <Link className="btn btn-outline-light me-2" to="/lostfound">
            Home
          </Link>

          <Link className="btn btn-outline-light me-2" to="/lostfound/items">
            All Items
          </Link>

          <Link className="btn btn-success" to="/lostfound/report">
            Report Item
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
