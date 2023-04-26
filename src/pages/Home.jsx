import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/";

export default function Home({ user }) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/dailyReport");
  };

  return (
    <>
      <Navbar user_role={user.user_role} />
      <div className="container pt-3">
        <h2>Welcome back {user.name}</h2>
        <button className="btn btn-primary" onClick={onClick}>
          Daily report
        </button>
      </div>
    </>
  );
}
