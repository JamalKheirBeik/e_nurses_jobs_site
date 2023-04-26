import { Navbar } from "../components/";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Admins({ user }) {
  const [admins, setAdmins] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const url = "http://localhost:3030/admin/search";
    axios
      .post(url, { admin_id: user.ID, searchFor: "4", searchQuery: "" })
      .then((res) => {
        if (!res.data.error) {
          setAdmins(res.data.data);
        }
      });
    return () => {
      setAdmins([]);
    };
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "http://localhost:3030/admin/add/admin";
    axios
      .post(url, { admin_id: user.ID, username, password })
      .then((res) => {
        if (!res.data.error) {
          setAdmins([{ ID: res.data.ID, username }, ...admins]);
        } else {
          setError(res.data.error);
        }
      })
      .catch((e) => {
        setError("Connection error");
      });
  };

  const onSearch = (event) => {
    event.preventDefault();
    const url = "http://localhost:3030/admin/search";
    axios
      .post(url, { admin_id: user.ID, searchFor: "4", searchQuery: query })
      .then((res) => {
        if (!res.data.error) {
          setAdmins(res.data.data);
        }
      });
  };

  return (
    <>
      <Navbar user_role={user.user_role} />
      <div className="container pt-3">
        <h3>Admins</h3>
        <div className="d-flex justify-content-between align-items-center">
          <button
            type="button"
            className="btn btn-success my-3"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add a new admin
          </button>

          <form className="d-flex" method="post" onSubmit={onSearch}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="query"
                name="query"
                autoComplete="off"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input className="btn btn-primary" type="submit" value="Search" />
            </div>
          </form>
        </div>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Enter admin data
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form method="post" onSubmit={onSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control my-3"
                      id="username"
                      name="username"
                      autoComplete="off"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control my-3"
                      id="password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="btn btn-primary form-control"
                      type="submit"
                      value="Add"
                    />
                  </div>
                  {error && (
                    <p className="alert alert-danger mt-3 p-2 text-center">
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        {admins.length === 0 ? (
          <p className="alert alert-info text-center mt-4">No admins</p>
        ) : (
          <table className="table mt-4">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{x.ID}</td>
                    <td>{x.username}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
