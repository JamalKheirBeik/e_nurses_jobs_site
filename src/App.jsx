import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  AdminHome,
  Login,
  AdminLogin,
  NotFound,
  DailyReport,
  Admins,
  Nurses,
  Patients,
  Carings,
  CaringTypes,
} from "./pages/";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("e-nurses-user"));
    if (currentUser) setUser(currentUser);
  }, []);

  return (
    <>
      <Routes>
        {/* NURSE ROUTES */}
        <Route
          exact
          path="/"
          element={
            user?.user_role === "nurse" ? (
              <Home user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dailyReport"
          element={
            user?.user_role === "nurse" ? (
              <DailyReport user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            user?.user_role !== "nurse" ? <Login /> : <Navigate to="/" />
          }
        />
        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            user?.user_role === "admin" ? (
              <AdminHome user={user} />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/dashboard/admins"
          element={
            user?.user_role === "admin" ? (
              <Admins user={user} />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/dashboard/nurses"
          element={
            user?.user_role === "admin" ? (
              <Nurses user={user} />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/dashboard/patients"
          element={
            user?.user_role === "admin" ? (
              <Patients user={user} />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/dashboard/carings"
          element={
            user?.user_role === "admin" ? (
              <Carings user={user} />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/dashboard/caringTypes"
          element={
            user?.user_role === "admin" ? (
              <CaringTypes user={user} />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user?.user_role !== "admin" ? (
              <AdminLogin user={user} />
            ) : (
              <Navigate to="/admin/dashboard" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
