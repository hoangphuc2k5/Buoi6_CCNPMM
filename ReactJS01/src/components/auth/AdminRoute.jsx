import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { fetchAccountThunk } from "../../Redux/authSlice";

const AdminRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, appLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !isAuthenticated) {
      dispatch(fetchAccountThunk());
    }
  }, [dispatch, isAuthenticated]);

  if (appLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
        <Spin />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
