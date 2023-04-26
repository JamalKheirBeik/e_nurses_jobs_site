import { Navbar } from "../components/";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Nurses({ user }) {
  const [nurses, setNurses] = useState([]);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [nurse, setNurse] = useState({}); // object used for edit
  const [editState, setEditState] = useState(0); // used to trigger the useEffect below

  useEffect(() => {
    const url = "https://e-nurses-jobs-api-v2.onrender.com/admin/search";
    axios
      .post(url, { admin_id: user.ID, searchFor: "0", searchQuery: "" })
      .then((res) => {
        if (!res.data.error) {
          setNurses(res.data.data);
        }
      });
    return () => {
      setNurses([]);
    };
  }, [editState]);

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "https://e-nurses-jobs-api-v2.onrender.com/admin/add/nurse";
    axios
      .post(url, { admin_id: user.ID, name, gender, phone, password })
      .then((res) => {
        if (!res.data.error && name.toLowerCase().includes(query)) {
          setNurses([
            ...nurses,
            {
              ID: res.data.ID,
              name,
              gender,
              phone,
              isResigned: "0",
            },
          ]);
          setError("");
          setSuccess(res.data.message);
        } else {
          setSuccess("");
          setError(res.data.error);
        }
      })
      .catch((e) => {
        setError("Connection error");
      });
  };

  const onEdit = (event) => {
    event.preventDefault();
    const url = "https://e-nurses-jobs-api-v2.onrender.com/admin/edit/nurse";
    axios
      .post(url, {
        admin_id: user.ID,
        nurse_id: nurse.ID,
        name: nurse.name,
        gender: nurse.gender,
        phone: nurse.phone,
        password: nurse.password,
        isResigned: nurse.isResigned.toString(),
      })
      .then((res) => {
        if (!res.data.error) {
          for (var i = 0; i < nurses.length; i++) {
            if (nurses[i].ID === nurse.ID) {
              nurses[i] = nurse;
              break;
            }
          }
          setError("");
          setSuccess(res.data.message);
          setTimeout(() => {
            setEditState(Math.random() * 1000);
            const elements = document.getElementsByClassName("modal-backdrop");
            Array.from(elements).forEach((element) => {
              element.classList.remove("modal-backdrop", "fade", "show");
            });
            document.body.style.overflow = "auto";
          }, 1000);
        } else {
          setSuccess("");
          setError(res.data.error);
        }
      })
      .catch((e) => {
        setError("Connection error");
      });
  };

  const onSearch = (event) => {
    event.preventDefault();
    const url = "https://e-nurses-jobs-api-v2.onrender.com/admin/search";
    axios
      .post(url, { admin_id: user.ID, searchFor: "0", searchQuery: query })
      .then((res) => {
        if (!res.data.error) {
          setNurses(res.data.data);
        }
      });
  };

  return (
    <>
      <Navbar user_role={user.user_role} />
      <div className="container pt-3">
        <h3>Nurses</h3>
        <div className="d-flex justify-content-between align-items-center">
          <button
            type="button"
            className="btn btn-success my-3"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => {
              setSuccess("");
              setError("");
            }}
          >
            Add a new nurse
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
                  Enter nurse data
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
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control my-3"
                      id="name"
                      name="name"
                      autoComplete="off"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      className="form-select my-3"
                      name="gender"
                      id="gender"
                      defaultValue={""}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value=""></option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
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
                      value="Add"
                    />
                  </div>
                  {error && (
                    <p className="alert alert-danger mt-3 p-2 text-center">
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="alert alert-success mt-3 p-2 text-center">
                      {success}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        {nurses.length === 0 ? (
          <p className="alert alert-info text-center mt-4">No nurses</p>
        ) : (
          <table className="table mt-4">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Gender</th>
                <th scope="col">Phone</th>
                <th scope="col">Resigned?</th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            <tbody>
              {nurses?.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{x.ID}</td>
                    <td>{x.name}</td>
                    <td>{x.gender}</td>
                    <td>{x.phone}</td>
                    <td>{x.isResigned === 1 ? "Yes" : "No"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger my-3"
                        onClick={() => {
                          setNurse(x);
                          setSuccess("");
                          setError("");
                        }}
                        data-bs-toggle="modal"
                        data-bs-target={"#modal" + i}
                      >
                        Edit
                      </button>
                      <div
                        className="modal fade"
                        id={"modal" + i}
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="exampleModalLabel"
                              >
                                Edit nurse data
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <form method="post" onSubmit={onEdit}>
                                <div className="form-group">
                                  <label htmlFor="name">Name</label>
                                  <input
                                    type="text"
                                    className="form-control my-3"
                                    id={"name" + i}
                                    name="name"
                                    defaultValue={x.name}
                                    autoComplete="off"
                                    onChange={(e) => {
                                      const { name, ...rest } = nurse;
                                      setNurse({
                                        name: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="gender">Gender</label>
                                  <select
                                    className="form-select my-3"
                                    name="gender"
                                    defaultValue={x.gender}
                                    id={"gender" + i}
                                    onChange={(e) => {
                                      const { gender, ...rest } = nurse;
                                      setNurse({
                                        gender: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="phone">Phone</label>
                                  <input
                                    type="text"
                                    className="form-control my-3"
                                    id={"phone" + i}
                                    name="phone"
                                    defaultValue={x.phone}
                                    autoComplete="off"
                                    onChange={(e) => {
                                      const { phone, ...rest } = nurse;
                                      setNurse({
                                        phone: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="password">Password</label>
                                  <input
                                    type="password"
                                    className="form-control my-3"
                                    id={"password" + i}
                                    name="password"
                                    placeholder="leave empty if it remains the same"
                                    onChange={(e) => {
                                      const { password, ...rest } = nurse;
                                      setNurse({
                                        password: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="isResigned">
                                    Is Resigned?
                                  </label>
                                  <select
                                    className="form-select my-3"
                                    name="isResigned"
                                    defaultValue={x.isResigned}
                                    id={"isResigned" + i}
                                    onChange={(e) => {
                                      const { isResigned, ...rest } = nurse;
                                      setNurse({
                                        isResigned: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  >
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                  </select>
                                </div>
                                <div className="form-group">
                                  <input
                                    className="btn btn-primary form-control"
                                    type="submit"
                                    value="Update"
                                  />
                                </div>
                                {error && (
                                  <p className="alert alert-danger mt-3 p-2 text-center">
                                    {error}
                                  </p>
                                )}
                                {success && (
                                  <p className="alert alert-success mt-3 p-2 text-center">
                                    {success}
                                  </p>
                                )}
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
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
