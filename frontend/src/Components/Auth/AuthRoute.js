import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

const AuthRoute = ({ children }) => {
  // Check user from Redux state
  const user = useSelector((state) => state?.auth?.user);
  
  // If user exists in Redux, allow access
  if (user) return children;

  // If Redux user is null, check local storage
  const token = getUserFromStorage();
  if (token) return children;

  // If no user or token, redirect to login
  return <Navigate to="/login" />;
};

export default AuthRoute;
