import { Link } from "react-router-dom";

export default function Navbar({ user_role }) {
  const logout = () => {
    localStorage.removeItem("e-nurses-user");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-5 py-3">
      <Link
        className="navbar-brand"
        to={user_role === "admin" ? "/admin/dashboard" : "/"}
      >
        E-NursesJobs
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav col-xl-6">
          {user_role === "admin" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard/admins">
                  Admins
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard/nurses">
                  Nurses
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard/patients">
                  Patients
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard/carings">
                  Carings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard/caringTypes">
                  Caring types
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="d-flex justify-content-xl-end col-xl-6">
          <button className="btn btn-outline-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
