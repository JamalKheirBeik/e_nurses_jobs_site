import axios from "axios";
import { useState, useEffect } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("e-nurses-user"));
    if (currentUser?.user_role !== "admin")
      localStorage.removeItem("e-nurses-user");
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "http://localhost:3030/admin/login";
    axios
      .post(url, { username, password })
      .then((res) => {
        if (!res.data.error) {
          localStorage.setItem(
            "e-nurses-user",
            JSON.stringify({ ...res.data, user_role: "admin" })
          );
          window.location.reload();
        } else {
          setError(res.data);
        }
      })
      .catch((e) => {
        setError({ error: "Connection error" });
      });
  };

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <h2 className="mb-5">Admin Login</h2>
      <form className="col-xl-3" method="post" onSubmit={onSubmit}>
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
            value="Login"
          />
        </div>
        {error && (
          <p className="alert alert-danger mt-3 text-center">{error.error}</p>
        )}
      </form>
    </div>
  );
}
