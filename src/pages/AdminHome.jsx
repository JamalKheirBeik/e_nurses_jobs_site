import { Navbar } from "../components/";

export default function AdminHome({ user }) {
  return (
    <>
      <Navbar user_role={user.user_role} />
      <div className="container pt-3">
        <p className="alert alert-info text-center">
          This is the admin dashboard browse the navbar links to view and modify
          the data
        </p>
      </div>
    </>
  );
}
