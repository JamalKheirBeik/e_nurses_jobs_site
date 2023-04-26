import { Navbar } from "../components/";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Carings({ user }) {
  const [carings, setCarings] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [caringTypes, setCaringTypes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [nurse, setNurse] = useState({}); // {id, name}
  const [caringType, setCaringType] = useState({}); // {id, name}
  const [patient, setPatient] = useState({}); // {id, name}
  const [time, setTime] = useState(""); // datetime
  const [description, setDescription] = useState(""); // text
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [caring, setCaring] = useState({}); // object used for edit
  const [editState, setEditState] = useState(0); // used to trigger the useEffect below

  useEffect(() => {
    const url = "http://localhost:3030/admin/search";
    // carings
    axios
      .post(url, { admin_id: user.ID, searchFor: "2", searchQuery: "" })
      .then((res) => {
        if (!res.data.error) {
          setCarings(res.data.data);
        }
      });
    // nurses
    axios
      .post(url, { admin_id: user.ID, searchFor: "0", searchQuery: "" })
      .then((res) => {
        if (!res.data.error) {
          setNurses(res.data.data);
        }
      });
    // caring types
    axios
      .post(url, { admin_id: user.ID, searchFor: "3", searchQuery: "" })
      .then((res) => {
        if (!res.data.error) {
          setCaringTypes(res.data.data);
        }
      });
    // patients
    axios
      .post(url, { admin_id: user.ID, searchFor: "1", searchQuery: "" })
      .then((res) => {
        if (!res.data.error) {
          setPatients(res.data.data);
        }
      });

    return () => {
      setCarings([]);
      setNurses([]);
      setCaringTypes([]);
      setPatients([]);
    };
  }, [editState]);

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "http://localhost:3030/admin/add/caring";
    axios
      .post(url, {
        admin_id: user.ID,
        nurse_id: nurse.ID,
        caring_type_id: caringType.ID,
        patient_id: patient.ID,
        time,
        description,
      })
      .then((res) => {
        const nameCondition =
          nurse.name.toLowerCase().includes(query) ||
          caringType.name.toLowerCase().includes(query) ||
          patient.name.toLowerCase().includes(query);
        if (!res.data.error && nameCondition) {
          setCarings([
            ...carings,
            {
              ID: res.data.ID,
              nurse_id: nurse.ID,
              nurse: nurse.name,
              caring_type_id: caringType.ID,
              caring_type: caringType.name,
              patient_id: patient.ID,
              patient: patient.name,
              time,
              description,
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
    const url = "http://localhost:3030/admin/edit/caring";
    axios
      .post(url, {
        admin_id: user.ID,
        caring_id: caring.ID,
        nurse_id: caring.nurse_id,
        caring_type_id: caring.caring_type_id,
        patient_id: caring.patient_id,
        time: caring.time,
        description: caring.description,
      })
      .then((res) => {
        if (!res.data.error) {
          for (var i = 0; i < carings.length; i++) {
            if (carings[i].ID === caring.ID) {
              carings[i] = caring;
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
      .post(url, { admin_id: user.ID, searchFor: "2", searchQuery: query })
      .then((res) => {
        if (!res.data.error) {
          setCarings(res.data.data);
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
            Add a new caring
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
                  Enter caring data
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
                    <label htmlFor="nurse">Nurse</label>
                    <select
                      className="form-control my-3"
                      name="nurse"
                      id="nurse"
                      defaultValue={""}
                      onChange={(e) =>
                        setNurse({
                          ID: e.target.value,
                          name: e.target.options[e.target.selectedIndex].text,
                        })
                      }
                    >
                      <option value=""></option>
                      {nurses?.map((n, i) => {
                        return (
                          <option key={"nurse" + i} value={n.ID}>
                            {n.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="caringType">Caring Type</label>
                    <select
                      className="form-control my-3"
                      name="caringType"
                      id="caringType"
                      defaultValue={""}
                      onChange={(e) =>
                        setCaringType({
                          ID: e.target.value,
                          name: e.target.options[e.target.selectedIndex].text,
                        })
                      }
                    >
                      <option value=""></option>
                      {caringTypes?.map((n, i) => {
                        return (
                          <option key={"caring" + i} value={n.ID}>
                            {n.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="patient">Patient</label>
                    <select
                      className="form-control my-3"
                      name="patient"
                      id="patient"
                      defaultValue={""}
                      onChange={(e) =>
                        setPatient({
                          ID: e.target.value,
                          name: e.target.options[e.target.selectedIndex].text,
                        })
                      }
                    >
                      <option value=""></option>
                      {patients?.map((n, i) => {
                        return (
                          <option key={"patient" + i} value={n.ID}>
                            {n.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="datetime">Date and time</label>
                    <input
                      className="form-control my-3"
                      type="datetime-local"
                      id="datetime"
                      name="datetime"
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control my-3"
                      name="description"
                      id="description"
                      onChange={(e) => setDescription(e.target.value)}
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
        {carings.length === 0 ? (
          <p className="alert alert-info text-center mt-4">No carings</p>
        ) : (
          <table className="table mt-4">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nurse</th>
                <th scope="col">Caring Type</th>
                <th scope="col">Patient</th>
                <th scope="col">DateTime</th>
                <th scope="col">Description</th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            <tbody>
              {carings?.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{x.ID}</td>
                    <td>{x.nurse}</td>
                    <td>{x.caring_type}</td>
                    <td>{x.patient}</td>
                    <td>{x.time.substring(0, 16).replace("T", " ")}</td>
                    <td>{x.description}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger my-3"
                        onClick={() => {
                          setCaring(x);
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
                                Edit caring data
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
                                  <label htmlFor="nurse">Nurse</label>
                                  <select
                                    className="form-control my-3"
                                    name="nurse"
                                    id="nurse"
                                    defaultValue={x.nurse_id}
                                    onChange={(e) => {
                                      const { nurse, nurse_id, ...rest } =
                                        caring;
                                      setCaring({
                                        nurse_id: e.target.value,
                                        nurse:
                                          e.target.options[
                                            e.target.selectedIndex
                                          ].text,
                                        ...rest,
                                      });
                                    }}
                                  >
                                    <option value=""></option>
                                    {nurses?.map((n, i) => {
                                      return (
                                        <option key={"nurse" + i} value={n.ID}>
                                          {n.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="caringType">
                                    Caring Type
                                  </label>
                                  <select
                                    className="form-control my-3"
                                    name="caringType"
                                    id="caringType"
                                    defaultValue={x.caring_type_id}
                                    onChange={(e) => {
                                      const {
                                        caring_type,
                                        caring_type_id,
                                        ...rest
                                      } = caring;
                                      setCaring({
                                        caring_type_id: e.target.value,
                                        caring_type:
                                          e.target.options[
                                            e.target.selectedIndex
                                          ].text,
                                        ...rest,
                                      });
                                    }}
                                  >
                                    <option value=""></option>
                                    {caringTypes?.map((n, i) => {
                                      return (
                                        <option key={"caring" + i} value={n.ID}>
                                          {n.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="patient">Patient</label>
                                  <select
                                    className="form-control my-3"
                                    name="patient"
                                    id="patient"
                                    defaultValue={x.patient_id}
                                    onChange={(e) => {
                                      const { patient, patient_id, ...rest } =
                                        caring;
                                      setCaring({
                                        patient_id: e.target.value,
                                        patient:
                                          e.target.options[
                                            e.target.selectedIndex
                                          ].text,
                                        ...rest,
                                      });
                                    }}
                                  >
                                    <option value=""></option>
                                    {patients?.map((n, i) => {
                                      return (
                                        <option
                                          key={"patient" + i}
                                          value={n.ID}
                                        >
                                          {n.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="datetime">
                                    Date and time
                                  </label>
                                  <input
                                    className="form-control my-3"
                                    type="datetime-local"
                                    id="datetime"
                                    name="datetime"
                                    defaultValue={x.time.substring(0, 16)}
                                    onChange={(e) => {
                                      const { time, ...rest } = caring;
                                      setCaring({
                                        time: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="description">
                                    Description
                                  </label>
                                  <textarea
                                    className="form-control my-3"
                                    name="description"
                                    id="description"
                                    defaultValue={x.description}
                                    onChange={(e) => {
                                      const { description, ...rest } = caring;
                                      setCaring({
                                        description: e.target.value,
                                        ...rest,
                                      });
                                    }}
                                  />
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
