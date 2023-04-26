import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../components/";

export default function DailyReport({ user }) {
  const [caring, setCaring] = useState([]);

  useEffect(() => {
    const url = "https://e-nurses-jobs-api-v2.onrender.com/getDailyReport";
    axios.post(url, { nurse_id: user.ID }).then((res) => {
      if (!res.data.error) {
        setCaring(res.data.data);
      }
    });
    return () => {
      setCaring([]);
    };
  }, []);

  return (
    <>
      <Navbar user_role={user.user_role} />
      <div className="container pt-3">
        <h3>Today's patients</h3>
        {caring.length === 0 ? (
          <p className="alert alert-info text-center mt-4">No patients</p>
        ) : (
          <table className="table mt-4">
            <thead>
              <tr>
                <th scope="col">Patient</th>
                <th scope="col">Caring type</th>
                <th scope="col">Time</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {caring?.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{x.patient}</td>
                    <td>{x.caring_type}</td>
                    <td>{x.time}</td>
                    <td>{x.description}</td>
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
