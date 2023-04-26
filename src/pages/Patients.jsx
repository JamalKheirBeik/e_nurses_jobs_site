import { Navbar } from "../components/";
import { useEffect, useState } from "react";
import avatar from "../avatar.png";
import axios from "axios";

export default function Patients({ user }) {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [patient, setNurse] = useState({}); // object used for edit
  const [editState, setEditState] = useState(0); // used to trigger the useEffect below

  useEffect(() => {
    const url = "http://localhost:3030/admin/search";
    axios
      .post(url, { admin_id: user.ID, searchFor: "1", searchQuery: "" })
      .then((res) => {
        if (!res.data.error) {
          setPatients(res.data.data);
        }
      });
    return () => {
      setPatients([]);
    };
  }, [editState]);

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "http://localhost:3030/admin/add/patient";
    axios
      .post(url, { admin_id: user.ID, name, room, photo })
      .then((res) => {
        if (!res.data.error && name.toLowerCase().includes(query)) {
          setPatients([
            ...patients,
            {
              ID: res.data.ID,
              name,
              room,
              photo,
              isStopped: "0",
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
    const url = "http://localhost:3030/admin/edit/patient";
    axios
      .post(url, {
        admin_id: user.ID,
        patient_id: patient.ID,
        name: patient.name,
        room: patient.room,
        photo: patient.photo,
        isStopped: patient.isStopped,
      })
      .then((res) => {
        if (!res.data.error) {
          for (var i = 0; i < patients.length; i++) {
            if (patients[i].ID === patient.ID) {
              patients[i] = patient;
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
    const url = "http://localhost:3030/admin/search";
    axios
      .post(url, { admin_id: user.ID, searchFor: "1", searchQuery: query })
      .then((res) => {
        if (!res.data.error) {
          setPatients(res.data.data);
        }
      });
  };

  return (
    <>
      <Navbar user_role={user.user_role} />
      <div className="container pt-3">
        <h3>Patients</h3>
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
            Add a new patient
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
                  Enter patient data
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
                    <label htmlFor="room">Room</label>
                    <input
                      type="text"
                      className="form-control my-3"
                      id="room"
                      name="room"
                      autoComplete="off"
                      onChange={(e) => setRoom(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="photo">Photo</label>
                    <input
                      type="text"
                      className="form-control my-3"
                      id="photo"
                      name="photo"
                      autoComplete="off"
                      onChange={(e) => setPhoto(e.target.value)}
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
        {patients.length === 0 ? (
          <p className="alert alert-info text-center mt-4">No patients</p>
        ) : (
          <table className="table mt-4">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Room</th>
                <th scope="col">Photo</th>
                <th scope="col">Stopped?</th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            <tbody>
              {patients?.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{x.ID}</td>
                    <td>{x.name}</td>
                    <td>{x.room}</td>
                    <td>
                      <img
                        style={{ width: "50px", height: "50px" }}
                        src={avatar}
                        alt={x.photo}
                      />
                    </td>
                    <td>{x.isStopped === 1 ? "Yes" : "No"}</td>
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
                                Edit patient data
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
                                      const { name, ...rest } = patient;
                                      setNurse({
                                        name: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="room">Room</label>
                                  <input
                                    type="text"
                                    className="form-control my-3"
                                    id={"room" + i}
                                    name="room"
                                    defaultValue={x.room}
                                    autoComplete="off"
                                    onChange={(e) => {
                                      const { room, ...rest } = patient;
                                      setNurse({
                                        room: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="photo">Photo</label>
                                  <input
                                    type="text"
                                    className="form-control my-3"
                                    id={"photo" + i}
                                    name="photo"
                                    defaultValue={x.photo}
                                    autoComplete="off"
                                    onChange={(e) => {
                                      const { photo, ...rest } = patient;
                                      setNurse({
                                        photo: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="isStopped">Is Stopped?</label>
                                  <select
                                    className="form-select my-3"
                                    name="isStopped"
                                    defaultValue={x.isStopped}
                                    id={"isStopped" + i}
                                    onChange={(e) => {
                                      const { isStopped, ...rest } = patient;
                                      setNurse({
                                        isStopped: e.target.value,
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
