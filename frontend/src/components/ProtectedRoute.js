import { React, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserState } from "../contexts/IsUserLoggedIn.js";

const ProtectedRouteElement = ({ element: Component }) => {
  const userStatement = useContext(UserState);
  return userStatement ? (
    Component
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default ProtectedRouteElement;
