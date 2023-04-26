import axios from "axios";
import { useState, useEffect } from "react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("e-nurses-user"));
    if (currentUser?.user_role !== "nurse")
      localStorage.removeItem("e-nurses-user");
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "http://localhost:3030/login";
    axios
      .post(url, { phone, password })
      .then((res) => {
        if (!res.data.error) {
          localStorage.setItem(
            "e-nurses-user",
            JSON.stringify({ ...res.data, user_role: "nurse" })
          );
          window.location.reload();
        } else {
          setError(res.data.error);
        }
      })
      .catch((e) => {
        setError("Connection error");
      });
  };

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <h2 className="mb-5">Nurse Login</h2>
      <form className="col-xl-3" method="post" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            className="form-control my-3"
            id="phone"
            name="phone"
            autoComplete="off"
            onChange={(e) => setPhone(e.target.value)}
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
          <p className="alert alert-danger mt-3 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
